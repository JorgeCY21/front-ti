import CalendarComponent from "../components/CalendarComponent";
import Navbar from "../components/Navbar";

function MonthlyConsumptions(){
  return (
    <div className="main">
      <Navbar />
      <div className="mx-6 flex flex-wrap">
        <div className="w-full md-w-1/2">
            <CalendarComponent/>
        </div>
        <div className="w-full md-w-1/2">

        </div>

      </div>
    </div>
  );
}

export default MonthlyConsumptions;