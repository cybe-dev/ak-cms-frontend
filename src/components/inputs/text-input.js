const { forwardRef } = require("react");

const TextInput = forwardRef(({ label, error, ...props }, ref) => (
  <div className="mb-3">
    <label className="roboto text-gray-700">{label}</label>
    <input
      ref={ref}
      {...props}
      className="border border-gray-300 block rounded-none w-full my-1 p-2 text-gray-600"
    />
    {error && <span className="text-sm text-red-600">{error}</span>}
  </div>
));

export default TextInput;
