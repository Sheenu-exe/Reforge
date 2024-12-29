import DockDemo from "./dock"

const MainLayout = ({children}) => {
    return(
        <div className="flex flex-col min-h-screen relative">
            <div className="flex-1">
                {children}
            </div>
            <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50">
                <div className="">
                    <DockDemo/>
                </div>
            </div>
        </div>
    )
}

export default MainLayout