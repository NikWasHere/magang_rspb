"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PatientRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    complaint: "",
    ktpNumber: "",
    ktpFile: null as File | null,
    kkNumber: "",
    kkFile: null as File | null,
    selectedPoli: "Klinik Pratama Pertamina",
    additionalDocuments: null as File | null,
    profilePhoto: null as File | null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // TODO: map selectedPoli to a real poli_id; using 1 as fallback
    fd.append("poli_id", "1");
    // TODO: replace with authenticated user id when available
    fd.append("user_id", "1");

    if (formData.ktpFile) fd.append("photo_ktp", formData.ktpFile);
    if (formData.kkFile) fd.append("photo_kk", formData.kkFile);
    if (formData.additionalDocuments)
      fd.append("more_document", formData.additionalDocuments);
    if (formData.profilePhoto)
      fd.append("profile_photo", formData.profilePhoto);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = `${baseUrl.replace(/\/$/, "")}/registrations`;

    try {
      setIsSubmitting(true);
      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }
      const result = await res.json();
      console.log("created registration", result);
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
            <p className="text-3xl font-bold text-green-600 mb-6">001</p>
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
                onClick={() => setIsSubmitted(false)}
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
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  {formData.profilePhoto ? (
                    <img
                      src={URL.createObjectURL(formData.profilePhoto)}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-10 h-10 text-gray-500"
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
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profilePhoto")}
                  className="hidden"
                  id="profile-photo"
                />
                <label
                  htmlFor="profile-photo"
                  className="text-green-600 hover:text-green-700 cursor-pointer font-medium text-sm"
                >
                  Upload Foto Diri
                </label>
              </div>
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
                  </Label>
                  <Input
                    id="complaint"
                    name="complaint"
                    type="text"
                    placeholder="Enter your complain"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
                    required
                  />
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
                      placeholder="Upload Kartu Tanda Penduduk"
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
                      placeholder="Upload Kartu Keluarga"
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
                </Label>
                <div className="relative">
                  <select
                    id="selectedPoli"
                    name="selectedPoli"
                    value={formData.selectedPoli}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="Klinik Pratama Pertamina">
                      Klinik Pratama Pertamina
                    </option>
                    <option value="Poliklinik Umum">Poliklinik Umum</option>
                    <option value="Poliklinik Gigi">Poliklinik Gigi</option>
                    <option value="Poliklinik Mata">Poliklinik Mata</option>
                    <option value="Poliklinik Jantung">
                      Poliklinik Jantung
                    </option>
                    <option value="Poliklinik Paru">Poliklinik Paru</option>
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
                    placeholder="Upload Dokumen Tambahan"
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
