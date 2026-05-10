"use client";

import { useState } from "react";
import { mockUser } from "../lib/mockData";

export default function ProfilePage() {
  const [formData, setFormData] = useState(mockUser);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className="max-w-4xl">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Personal Information</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Update your details</h3>
        </div>

        <form className="space-y-8 p-6 sm:p-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center">
            <img
              src={formData.image}
              alt={formData.name}
              className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/10"
            />
            <div>
              <h4 className="text-base font-semibold text-white">Profile Photo</h4>
              <p className="mt-1 text-sm text-slate-400">
                Upload a new photo or update your existing one.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["Full Name", "name", "text", formData.name],
              ["Email Address", "email", "email", formData.email],
              ["Phone Number", "phoneNumber", "tel", formData.phoneNumber ?? ""],
              ["Location", "address", "text", formData.address ?? ""],
            ].map(([label, name, type, value]) => (
              <div key={String(name)}>
                <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor={String(name)}>
                  {label}
                </label>
                <input
                  id={String(name)}
                  name={String(name)}
                  type={String(type)}
                  value={String(value)}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="linkedinLink">
                LinkedIn Profile
              </label>
              <input
                id="linkedinLink"
                name="linkedinLink"
                type="url"
                value={formData.linkedinLink ?? ""}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="description">
                Bio
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description ?? ""}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
