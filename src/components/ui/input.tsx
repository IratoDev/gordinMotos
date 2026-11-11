
interface InputTypes {
    type:string,
    name:string,
    value:string
    handleChange: ()=> void,
    placeholder: string,
}


export function Inpunt({type, name, value, handleChange, placeholder}:InputTypes){
    return(
        <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full min-w-0 rounded-md border border-cinza-300 bg-branco px-3 py-2.5 text-sm text-cinza-700 outline-none transition focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
        />
    )
}