
interface SelectTypes {
    name:string,
    value:string,
    handleChange: ()=> void,
    list:[] | string[]
}


export function Select({name, value, handleChange, list}:SelectTypes){
    return(
       <select
                  name={name}
                  value={value}
                  onChange={handleChange}
                  className="w-full rounded-md border border-cinza-300 bg-white px-3 py-3 text-sm text-cinza-700 outline-none focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
                >
                  <option value="">Selecione a marca</option>

                  {list.map((list) => (
                    <option key={list} value={list}>
                      {list}
                    </option>
                  ))}
        </select>
    )
}