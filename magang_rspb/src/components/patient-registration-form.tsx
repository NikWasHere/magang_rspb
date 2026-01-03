"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnoseService } from "@/services/diagnoseServices";

type PoliOption = { id: number; name: string };

const baseApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

export default function PatientRegistrationForm() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    complaint: "",
    ktpNumber: "",
    ktpFile: null as File | null,
    kkNumber: "",
    kkFile: null as File | null,
    selectedPoli: "",
    selectedDokter: "",
    additionalDocuments: null as File | null,
    profilePhoto: null as File | null,
  });

  const [poliOptions, setPoliOptions] = useState<PoliOption[]>([]);
  const [dokterOptions, setDokterOptions] = useState<any[]>([]);
  const [selectedDokterSchedule, setSelectedDokterSchedule] = useState<any[]>(
    []
  );
  const [loadingPoli, setLoadingPoli] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);

  // AI Recommendation state
  const [aiRecommendation, setAiRecommendation] = useState<{
    confidence: number;
    reason: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchPoli = async () => {
      try {
        setLoadingPoli(true);
        console.log("Fetching polis from:", `${baseApiUrl}/polis`);

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseApiUrl}/polis`, {
          headers,
          cache: "no-store",
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          // If 401, it might be a public endpoint or token issue
          if (res.status === 401) {
            console.warn(
              "Unauthorized access to polis endpoint. Trying without token..."
            );
            // Try again without Authorization header
            const publicRes = await fetch(`${baseApiUrl}/polis`, {
              headers: { "Content-Type": "application/json" },
              cache: "no-store",
            });

            if (publicRes.ok) {
              const data = await publicRes.json();
              const normalized = (data || []).map((p: any) => ({
                id: p.id,
                name: p.name,
              }));
              setPoliOptions(normalized);
              if (normalized.length > 0) {
                setFormData((prev) => ({
                  ...prev,
                  selectedPoli: String(normalized[0].id),
                }));
              }
              return;
            }
          }
          console.error("Failed to fetch polis:", res.status);
          return;
        }

        const data = await res.json();
        console.log("Polis data:", data);
        const normalized = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
        }));
        console.log("Normalized polis:", normalized);
        setPoliOptions(normalized);
        if (normalized.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedPoli: String(normalized[0].id),
          }));
        }
      } catch (err) {
        console.error("fetch poli error", err);
      } finally {
        setLoadingPoli(false);
      }
    };

    fetchPoli();
  }, [token]);

  // AI symptom analysis with debounce
  useEffect(() => {
    if (!formData.complaint || formData.complaint.length < 3) {
      setAiRecommendation(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsAnalyzing(true);
        const result = await DiagnoseService.analyzeSymptoms(
          formData.complaint,
          token || undefined
        );

        if (result.recommendedPoli) {
          // Auto-select recommended poli
          setFormData((prev) => ({
            ...prev,
            selectedPoli: String(result.recommendedPoli!.id),
          }));

          // Show recommendation details
          setAiRecommendation({
            confidence: result.confidence,
            reason: result.reason,
          });
        }
      } catch (error) {
        console.error("AI analysis error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [formData.complaint, token]);

  // Fetch dokters when poli changes
  useEffect(() => {
    if (!formData.selectedPoli) {
      setDokterOptions([]);
      setSelectedDokterSchedule([]);
      return;
    }

    const fetchDokters = async () => {
      try {
        console.log("🔍 Fetching dokters for poli:", formData.selectedPoli);
        const res = await fetch(
          `${baseApiUrl}/dokters/by-poli/${formData.selectedPoli}`
        );
        if (res.ok) {
          const dokters = await res.json();
          console.log("📋 Dokters received:", dokters);
          console.log("📊 Total dokters:", dokters.length);
          setDokterOptions(dokters);
          if (dokters.length > 0) {
            setFormData((prev) => ({
              ...prev,
              selectedDokter: String(dokters[0].id),
            }));
            setSelectedDokterSchedule(dokters[0].jadwal || []);
          } else {
            console.warn("⚠️ No dokters found for this poli!");
          }
        } else {
          console.error("❌ Failed to fetch dokters:", res.status);
        }
      } catch (error) {
        console.error("Error fetching dokters:", error);
      }
    };

    fetchDokters();
  }, [formData.selectedPoli]);

  // Update schedule when dokter changes
  useEffect(() => {
    if (formData.selectedDokter && dokterOptions.length > 0) {
      const selectedDokter = dokterOptions.find(
        (d) => d.id === parseInt(formData.selectedDokter)
      );
      setSelectedDokterSchedule(selectedDokter?.jadwal || []);
    }
  }, [formData.selectedDokter, dokterOptions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0] || null;

    // Validate file
    if (file) {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert(
          `File terlalu besar! Maksimal ukuran file adalah 5MB.\nUkuran file Anda: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        e.target.value = ""; // Reset input
        return;
      }

      // Check file type for images
      if (
        fieldName === "profilePhoto" ||
        fieldName === "ktpFile" ||
        fieldName === "kkFile"
      ) {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          alert(
            "Format file tidak didukung! Gunakan format: JPG, JPEG, PNG, atau WEBP"
          );
          e.target.value = ""; // Reset input
          return;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const fd = new FormData();
    fd.append("full_name", formData.fullName);
    fd.append("keluhan", formData.complaint);
    fd.append("nik", formData.ktpNumber);
    fd.append("no_kk", formData.kkNumber);

    const poliId =
      formData.selectedPoli ||
      (poliOptions[0] ? String(poliOptions[0].id) : "1");
    fd.append("poli_id", poliId);
    if (formData.selectedDokter) {
      fd.append("dokter_id", formData.selectedDokter);
    }
    fd.append("user_id", user?.id ? String(user.id) : "1");

    if (formData.ktpFile) fd.append("photo_ktp", formData.ktpFile);
    if (formData.kkFile) fd.append("photo_kk", formData.kkFile);
    if (formData.additionalDocuments)
      fd.append("more_document", formData.additionalDocuments);
    if (formData.profilePhoto)
      fd.append("photo_profile", formData.profilePhoto);

    // Debug: Log what we're sending
    console.log("📤 Sending registration data:");
    console.log("- Full Name:", formData.fullName);
    console.log("- KTP File:", formData.ktpFile?.name);
    console.log("- KK File:", formData.kkFile?.name);
    console.log("- Profile Photo:", formData.profilePhoto?.name);
    console.log("- Additional Doc:", formData.additionalDocuments?.name);

    const url = `${baseApiUrl}/registrations`;

    try {
      setIsSubmitting(true);
      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }
      const result = await res.json();
      console.log("✅ Registration response:", result);
      if (result?.queue_number) {
        setQueueNumber(String(result.queue_number));
      } else if (result?.id) {
        setQueueNumber(String(result.id));
      } else {
        setQueueNumber(null);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("registration error", err);
      alert("Gagal mengirim pendaftaran: " + (err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success modal/page
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-600 mb-2">Nomor Antrian Anda:</p>
            <p className="text-3xl font-bold text-green-600 mb-6">
              {queueNumber || "-"}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Silakan datang 30 menit sebelum jam praktik dan tunjukkan nomor
              antrian ini.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => (window.location.href = "/cek-status")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Cek Status
              </Button>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setQueueNumber(null);
                }}
                variant="outline"
                className="w-full"
              >
                Daftar Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-8">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg overflow-hidden">
                {formData.profilePhoto ? (
                  <img
                    src={URL.createObjectURL(formData.profilePhoto)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profilePhoto")}
                className="hidden"
                id="profile-photo"
              />
              <label htmlFor="profile-photo">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {formData.profilePhoto ? "Ganti Foto" : "Upload Foto Diri"}
                </span>
              </label>
              {formData.profilePhoto && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  {formData.profilePhoto.name}
                </p>
              )}
              <p className="text-xs text-gray-400 text-center mt-1">
                Maks. 5MB (JPG, PNG)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two-column grid for main fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-gray-700 font-medium"
                  >
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Keluhan */}
                <div className="space-y-2">
                  <Label
                    htmlFor="complaint"
                    className="text-gray-700 font-medium"
                  >
                    Keluhan
                    {isAnalyzing && (
                      <span className="ml-2 text-xs text-blue-600">
                        Menganalisis gejala...
                      </span>
                    )}
                  </Label>
                  <Input
                    id="complaint"
                    name="complaint"
                    type="text"
                    placeholder="Contoh: demam, batuk, sakit kepala..."
                    value={formData.complaint}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
                    required
                  />
                  {aiRecommendation && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Rekomendasi (Confidence:{" "}
                            {aiRecommendation.confidence}%)
                          </p>
                          <p className="text-xs text-blue-700">
                            {aiRecommendation.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* No KTP */}
                <div className="space-y-2">
                  <Label
                    htmlFor="ktpNumber"
                    className="text-gray-700 font-medium"
                  >
                    No KTP
                  </Label>
                  <Input
                    id="ktpNumber"
                    name="ktpNumber"
                    type="text"
                    placeholder="Enter your KTP number"
                    value={formData.ktpNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Upload KTP */}
                <div className="space-y-2">
                  <Label
                    htmlFor="ktpFile"
                    className="text-gray-700 font-medium"
                  >
                    Upload KTP
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Upload Kartu Tanda Penduduk (JPG/PNG)"
                      value={formData.ktpFile?.name || ""}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg"
                      readOnly
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "ktpFile")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="ktp-file"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="whitespace-nowrap bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Select file
                      </Button>
                    </div>
                  </div>
                </div>

                {/* No KK */}
                <div className="space-y-2">
                  <Label
                    htmlFor="kkNumber"
                    className="text-gray-700 font-medium"
                  >
                    No KK
                  </Label>
                  <Input
                    id="kkNumber"
                    name="kkNumber"
                    type="text"
                    placeholder="Enter your KK Number"
                    value={formData.kkNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Upload KK */}
                <div className="space-y-2">
                  <Label htmlFor="kkFile" className="text-gray-700 font-medium">
                    Upload KK
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Upload Kartu Keluarga (JPG/PNG)"
                      value={formData.kkFile?.name || ""}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg"
                      readOnly
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "kkFile")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="kk-file"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="whitespace-nowrap bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Select file
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilih Poli - Full width */}
              <div className="space-y-2">
                <Label
                  htmlFor="selectedPoli"
                  className="text-gray-700 font-medium"
                >
                  Pilih Poli
                  {aiRecommendation && (
                    <span className="ml-2 text-xs text-green-600 font-normal">
                      ✓ Dipilih otomatis berdasarkan keluhan
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <select
                    id="selectedPoli"
                    name="selectedPoli"
                    value={formData.selectedPoli}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    required
                    disabled={loadingPoli || poliOptions.length === 0}
                  >
                    {poliOptions.length === 0 && (
                      <option value="">Loading poli...</option>
                    )}
                    {poliOptions.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Pilih Dokter - Full width */}
              <div className="space-y-2">
                <Label
                  htmlFor="selectedDokter"
                  className="text-gray-700 font-medium"
                >
                  Pilih Dokter
                </Label>
                <div className="relative">
                  <select
                    id="selectedDokter"
                    name="selectedDokter"
                    value={formData.selectedDokter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    required
                    disabled={dokterOptions.length === 0}
                  >
                    {dokterOptions.length === 0 && (
                      <option value="">Pilih poli terlebih dahulu</option>
                    )}
                    {dokterOptions.map((d) => (
                      <option key={d.id} value={String(d.id)}>
                        {d.name} - {d.specialization}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {/* Jadwal Dokter */}
                {selectedDokterSchedule.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Jadwal Praktik:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDokterSchedule.map((jadwal, idx) => (
                        <div key={idx} className="text-xs text-blue-700">
                          <span className="font-medium">{jadwal.hari}:</span>{" "}
                          {jadwal.jam}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dokumen Tambahan - Full width */}
              <div className="space-y-2">
                <Label
                  htmlFor="additionalDocuments"
                  className="text-gray-700 font-medium"
                >
                  Dokumen Tambahan (Opsional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Upload Dokumen Tambahan (JPG/PNG)"
                    value={formData.additionalDocuments?.name || ""}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg"
                    readOnly
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) =>
                        handleFileChange(e, "additionalDocuments")
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="additional-docs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="whitespace-nowrap bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Select file
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="px-12 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full text-lg"
                >
                  Daftar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
