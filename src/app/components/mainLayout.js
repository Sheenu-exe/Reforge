import DockDemo from "./dock"

const MainLayout = ({children}) => {
    return(
        <div className="flex flex-col min-h-screen relative">
            <div className="flex-1">
                {children}
            </div>
            <div className="fixed bottom-0 left-0 w-full sm:w-fit h-fit z-50 ">
                <DockDemo/>
            </div>
        </div>
    )
}

export default MainLayout