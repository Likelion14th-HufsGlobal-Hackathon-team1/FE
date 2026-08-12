import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./assets/Navbar";
import GlobalStyles from "./styles/GlobalStyles";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Mypage from "./pages/Mypage";

import CareUpload from "./pages/CareUpload";
import CareResult from "./pages/CareResult";

import JourneyTrip from "./pages/JourneyTrip";
import JourneyMake from "./pages/JourneyMake";
import JourneyDesign from "./pages/JourneyDesign";
import JourneyCharm from "./pages/JourneyCharm";
import JourneyDetail from "./pages/JourneyDetail";

const AppContent = styled.main`
  min-height: 100svh;
  box-sizing: border-box;
  padding-bottom: calc(105px + env(safe-area-inset-bottom));
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppContent>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<Mypage />} />

          <Route path="/care/upload" element={<CareUpload />} />
          <Route path="/care/result" element={<CareResult />} />

          <Route path="/journey/trip" element={<JourneyTrip />} />
          <Route path="/journey/make" element={<JourneyMake />} />
          <Route path="/journey/design" element={<JourneyDesign />} />
          <Route path="/journey/charm" element={<JourneyCharm />} />
          <Route path="/journey/detail" element={<JourneyDetail />} />
        </Routes>
      </AppContent>
      <Navbar />
    </BrowserRouter>
  );
}

export default App;
