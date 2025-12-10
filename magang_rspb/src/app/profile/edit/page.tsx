"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    username: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return setLoading(false);
    const fetchProfile = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${baseUrl.replace(/\/$/, "")}/users/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        // Backend returns { user: {...} }
        const userData = data.user || data;
        const base = baseUrl.replace(/\/$/, "");
        const imageUrl = userData.image
          ? userData.image.startsWith("http")
            ? userData.image
            : `${base}${userData.image.startsWith("/") ? userData.image : `/${userData.image}`}`
          : "";

        setForm({
          name: userData.name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          username: userData.username || "",
          image: imageUrl,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadingPhoto(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/users/profile/photo/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await res.json();
      const base = baseUrl.replace(/\/$/, "");
      const uploadedUrl = data.imageUrl
        ? data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `${base}${data.imageUrl.startsWith("/") ? data.imageUrl : `/${data.imageUrl}`}`
        : "";

      // Update form with new image URL from backend
      setForm((prev) => ({ ...prev, image: uploadedUrl }));

      // Refresh user data di AuthContext untuk update navbar
      await refreshUser();

      alert("Foto berhasil diupload!");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Gagal upload foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("token");

      // Only send name, phone, address, username (not image - handled separately)
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        username: form.username,
      };

      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/users/profile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        let errorMsg = error.message || "Gagal menyimpan perubahan";

        // Make error messages more user-friendly
        if (errorMsg.includes("Username")) {
          errorMsg = "Username sudah digunakan. Silakan pilih username lain.";
        }
        if (errorMsg.includes("phone")) {
          errorMsg = "Nomor telepon sudah digunakan.";
        }

        throw new Error(errorMsg);
      }

      // Update localStorage dengan data terbaru
      const updatedUserData = {
        ...user,
        name: form.name,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

      alert("Profile berhasil diupdate!");

      // Refresh user data di AuthContext untuk update navbar
      await refreshUser();

      router.refresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="mb-4">Anda belum login.</p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* Centered avatar upload like daftar-online */}
                <div className="flex justify-center mb-6">
                  <label
                    htmlFor="image-upload"
                    className="group relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 cursor-pointer flex items-center justify-center"
                  >
                    {uploadingPhoto ? (
                      <div className="text-xs text-gray-500">Uploading...</div>
                    ) : form.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.image}
                        alt={
                          form.name
                            ? `${form.name} avatar`
                            : `${form.username || "avatar"}`
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="text-4xl font-bold text-blue-600">
                          {form.name && form.name.trim()
                            ? form.name
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word.charAt(0).toUpperCase())
                                .join("")
                            : form.username && form.username.trim()
                            ? form.username
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word.charAt(0).toUpperCase())
                                .join("")
                            : "?"}
                        </div>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  className="block mx-auto mt-2 text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium"
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? "Uploading foto..." : "Edit Foto Profile"}
                </button>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
