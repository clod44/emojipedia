import './App.css'
import Navbar from './components/Navbar/Navbar'
import Search from './components/Search/Search'
function App() {

    return (
        <>
            <Navbar />
            <div className="container mx-auto mb-5">
                <Search />
            </div>

            <a className="btn btn-sm btn-ghost" href="#" target='_blank'>Github @clod44</a>

        </>
    )
}

export default App
