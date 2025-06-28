
import HomeComponent from "../components/HomeComponent";
import Navbar from "../components/Navbar";

function Home() {
    return (
    <div className="main">
        <Navbar />
        <main className="mx-6">
            <HomeComponent/>
        </main> 
    </div>
    )
}

export default Home;