import { forwardRef } from "react";
import { default as ReactSelect } from "react-select/creatable";

const CreatableSelect = forwardRef(({ label, error, ...props }, ref) => (
  <div className="mb-3">
    <label className="roboto text-gray-700">{label}</label>
    <ReactSelect ref={ref} classNamePrefix="react-select" {...props} />
    {error && <span className="text-sm text-red-600">{error}</span>}
  </div>
));

export default CreatableSelect;
