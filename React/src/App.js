import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Main from "./Components/Main/Main";
import { RecoilRoot } from "recoil";
import SpinnerModal from "./Components/Spinner/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <RecoilRoot>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <SpinnerModal />
      <div className="App">
        <header className="App-Header">
          <Header />
        </header>
        <div className="App-Body">
          <Main />
        </div>
        <footer className="App-Footer">
          <Footer />
        </footer>
      </div>
    </RecoilRoot>
  );
}

export default App;
