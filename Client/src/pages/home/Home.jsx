import Navbar from "../../components/navbar/Navbar";
import HomePageContent from "../../components/HomePageContent/HomePageContent";
import ImageGraphic from "../../components/ImageGraphic/ImageGraphic";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="content">
        <HomePageContent />
        <ImageGraphic />
      </div>
    </div>
  );
};

export default Home;