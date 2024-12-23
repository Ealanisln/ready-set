import { UseFormRegister } from "react-hook-form";

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const CountiesSelection = ({ register }: RegisterProps) => {
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
                  {...register('selectedCounties')} 
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
                  {...register('selectedCounties')} 
                />
                <span>{county}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};