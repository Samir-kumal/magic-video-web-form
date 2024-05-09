
interface ProgressNumHeaderProps {
    progress: number
    }
const ProgressNumHeader = ({progress}: ProgressNumHeaderProps) => {
  return (
    <section className="flex w-1/2 justify-around my-2">
    <div>
      <h2
        className={`text-xl font-bold transition-all ${
          progress === 20 ? "bg-black text-white" : "bg-white text-black"
        } p-4 rounded-full w-10 h-10 flex items-center justify-center`}
      >
        1
      </h2>
    </div>
    <div>
      <h2
        className={`text-xl font-bold transition-all ${
          progress === 40 ? "bg-black text-white" : "bg-white text-black"
        } p-4 rounded-full w-10 h-10 flex items-center justify-center`}
      >
        2
      </h2>
    </div>

    <div>
      <h2
        className={`text-xl font-bold transition-all ${
          progress === 60 ? "bg-black text-white" : "bg-white text-black"
        }  p-4 rounded-full w-10 h-10 flex items-center justify-center`}
      >
        3
      </h2>
    </div>
    <div>
      <h2
        className={`text-xl font-bold transition-all ${
          progress === 80 ? "bg-black text-white" : "bg-white text-black"
        }  p-4 rounded-full w-10 h-10 flex items-center justify-center`}
      >
        4
      </h2>
    </div>
    <div>
      <h2
        className={`text-xl font-bold transition-all ${
          progress === 100 ? "bg-black text-white" : "bg-white text-black"
        }  p-4 rounded-full w-10 h-10 flex items-center justify-center`}
      >
        5
      </h2>
    </div>
  </section>
  )
}

export default ProgressNumHeader