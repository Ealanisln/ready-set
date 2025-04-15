import { CateringFormData, ExtendedCateringFormData } from "@/types/catering";
import { Control } from "react-hook-form";
import { InputField } from "./FormFields/InputField";
import { CateringNeedHost } from "@/types/order";
import { Clock, Users } from "lucide-react";
import { UploadedFile } from "@/hooks/use-upload-file";

// components/CateringForm/HostSection.tsx
interface HostSectionProps {
    control: Control<ExtendedCateringFormData>;
    needHost: CateringNeedHost;
}

export const HostSection: React.FC<HostSectionProps> = ({ control, needHost }) => {
    if (needHost !== CateringNeedHost.YES) return null;

    return (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <h3 className="mb-5 text-lg font-medium text-blue-800">Host Details</h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <InputField
                    control={control}
                    name="hoursNeeded"
                    label="Hours Needed"
                    type="number"
                    required
                    placeholder="Enter number of hours"
                    rules={{
                        min: { value: 1, message: "Minimum 1 hour required" },
                        max: { value: 24, message: "Maximum 24 hours allowed" }
                    }}
                    icon={<Clock className="h-4 w-4" />}
                />
                <InputField
                    control={control}
                    name="numberOfHosts"
                    label="Number of Hosts"
                    type="number"
                    required
                    placeholder="Enter number of hosts"
                    rules={{
                        min: { value: 1, message: "Minimum 1 host required" },
                        max: { value: 10, message: "Maximum 10 hosts allowed" }
                    }}
                    icon={<Users className="h-4 w-4" />}
                />
            </div>
        </div>
    );
};