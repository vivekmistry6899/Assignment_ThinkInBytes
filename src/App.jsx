import logo from "./logo.svg";
import "./App.css";
import CustomSelect from "./components/CustomSelect";

function App() {
  return (
    <div className="App">
      <div className="search-section">
        <label>Beers</label>
        <CustomSelect />
      </div>
    </div>
  );
}

export default App;
