import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { FoodFormData } from "../../types";

interface CountiesSelectionProps {
  register: UseFormRegister<any>;
  errors?: FieldErrors<FoodFormData>;  // Changed from error?: FieldError
}

export const CountiesSelection = ({ register, errors }: CountiesSelectionProps) => {
  const californiaCounties = [
    "Alameda",
    "Marin",
    "SanFrancisco",
    "Solano",
    "ContraCosta",
    "Napa",
    "SanMateo",
    "Sonoma",
  ];

  const texasCounties = ["Dallas", "Travis"];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Counties Serviced</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">California</h4>
          <div className="space-y-2">
            {californiaCounties.map((county) => (
              <label key={county} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  value={county}
                  {...register('counties')}
                />
                <span>{county}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Texas</h4>
          <div className="space-y-2">
            {texasCounties.map((county) => (
              <label key={county} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  value={county}
                  {...register('counties')}
                />
                <span>{county}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {errors?.counties && (
        <p className="text-sm text-red-500">
          {errors.counties.message}
        </p>
      )}
    </div>
  );
};