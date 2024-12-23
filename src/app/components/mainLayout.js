import DockDemo from "./dock"

const MainLayout = ({children}) => {
    return(
        <div className="flex flex-col">
            {children}
           <div className="sticky bottom-5 h-[10vh] left-0 w-full flex justify-center items-center">
            <DockDemo/>
           </div>
        </div>
    )
}
export default MainLayout