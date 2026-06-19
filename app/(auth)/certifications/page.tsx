import CertificationsClient from "./CertificationsClient";
import { getCertifications } from "@/app/_actions/certifications/getcertifications";
import { addCertification } from "@/app/_actions/certifications/addcertification";
import { editCertification } from "@/app/_actions/certifications/editcertification";
import { deleteCertification } from "@/app/_actions/certifications/deletecertification";
import { uploadCertificationImage } from "@/app/_actions/certifications/uploadcertificationimage";

export default async function CertificationsPage() {
  const result = await getCertifications();

  if (!result.success || !result.data) {
    return <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{result.error || "Failed to load certifications."}</div>;
  }

  return (
    <CertificationsClient
      initialCertifications={result.data}
      addCertificationAction={addCertification}
      editCertificationAction={editCertification}
      deleteCertificationAction={deleteCertification}
      uploadCertificationImageAction={uploadCertificationImage}
    />
  );
}
