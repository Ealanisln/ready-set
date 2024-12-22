import { UseFormRegister } from "react-hook-form";

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const CountiesSelection = ({ register }: RegisterProps) => {
  const californiaCounties = [
    "alameda",
    "marin",
    "sanFrancisco",
    "solano",
    "contraCosta",
    "napa",
    "sanMateo",
    "sonoma",
  ];

  const texasCounties = ["dallas", "travis"];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Counties Serviced</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">California</h4>
          <div className="space-y-2">
            {californiaCounties.map((county) => (
              <label key={county} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`counties.${county}`)} />
                <span>{county.charAt(0).toUpperCase() + county.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Texas</h4>
          <div className="space-y-2">
            {texasCounties.map((county) => (
              <label key={county} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`counties.${county}`)} />
                <span>{county.charAt(0).toUpperCase() + county.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
