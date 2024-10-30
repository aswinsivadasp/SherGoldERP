import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchemeRegistration from './components/SchemeRegistration';
import SchemeCashReceipt from './components/SchemeCashReceipt';
import SchemeRedeem from './components/SchemeRedeem';
import HomePageMob from './pages/HomePageMob';
import SchemeRegistrationMob from './components/SchemeRegistrationMob';
import LedgerReg from './components/LedgerReg';
import SchemeReport from './components/SchemeReport';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import StaffReg from './components/StaffReg';
import SchemeCashReceiptMob from './components/SchemeCashReceiptMob';
import Print from './components/Print';
import PrintMob from './components/PrintMob';
import AuthProvider from './context/AuthContext';
import { DbProvider } from './context/DbContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RateClassReg from './components/RateClassReg';
import RateSettings from './components/RateSettings';
import ReceiptList from './components/ReceiptList';
import FormRegistration from './components/FormRegistration';
import DayBook from './components/DayBook';
import DayBookReport from './components/DayBookReport';
import JournalEntry from './components/JournalEntry';
import ContraEntry from './components/ContraEntry';
import LedgerRepModel from './components/LedgerRepModel';
import LedgerReport from './components/LedgerReport';
import CreateDb from './pages/CreateDb';
import CreateCompany from './components/CreateCompany';
import QuickSearch from './components/QuickSearch';
import StaffRegMob from './components/StaffRegMob';
import AgentReport from './components/AgentReport';
import AgentReportModel from './components/AgentReportModel';
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
import "@fontsource/inter/400-italic.css"; // Specify weight and style
import OpenCompany from './components/OpenCompany';
import OpenCompanyMob from './pages/OpenCompanyMob';
import EmailVerification from './components/EmailVerification';
import SmsSettings from './components/SmsSettings';
// import 'normalize.css';


function App() {
  // const isMobile = window.innerWidth < 768;
  const isMobileOrTablet = window.innerWidth < 1024;



  return (
    <div className="App">
      <AuthProvider>
        <DbProvider>
          <Router>
            <Routes>
              {isMobileOrTablet ? (
                <Route path="/" element={<OpenCompanyMob />} />

              ) : (

                <Route path="/" element={<CreateDb />} />

              )}
              <Route path="/createcompany" element={<CreateCompany />} />
              <Route path="/opencompany" element={<ProtectedRoute element={<OpenCompany />} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verifyemail" element={<EmailVerification />} />

              <Route path="/signUp" element={<ProtectedRoute element={<SignUp />} />} />

              {isMobileOrTablet ? (
                <Route path="/home" element={<ProtectedRoute element={<HomePageMob />} />} />
              ) : (
                <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
              )}

              {isMobileOrTablet ? (
                <Route path="/registration" element={<ProtectedRoute element={<SchemeRegistrationMob />} />} />
              ) : (
                <Route path="/registration" element={<ProtectedRoute element={<SchemeRegistration />} />} />
              )}

              <Route path="/receiptmob" element={<ProtectedRoute element={<SchemeCashReceiptMob />} />} />

              {isMobileOrTablet ? (
                <Route path="/receipt" element={<ProtectedRoute element={<SchemeCashReceiptMob />} />} />
              ) : (
                <Route path="/receipt" element={<ProtectedRoute element={<SchemeCashReceipt />} />} />
              )}

              <Route path="/redeem" element={<ProtectedRoute element={<SchemeRedeem />} />} />
              <Route path="/ledger" element={<ProtectedRoute element={<LedgerReg />} />} />
              <Route path="/staffreg" element={<ProtectedRoute element={<StaffReg />} />} />
              <Route path="/staffregmob" element={<ProtectedRoute element={<StaffRegMob />} />} />

              <Route path="/report" element={<ProtectedRoute element={<SchemeReport />} />} />
              <Route path="/print" element={<ProtectedRoute element={<Print />} />} />
              <Route path="/printMob" element={<ProtectedRoute element={<PrintMob />} />} />
              <Route path="/rateClass" element={<ProtectedRoute element={<RateClassReg />} />} />
              <Route path="/rateSettings" element={<ProtectedRoute element={<RateSettings />} />} />
              <Route path="/receiptList" element={<ProtectedRoute element={<ReceiptList />} />} />
              <Route path="/formReg" element={<ProtectedRoute element={<FormRegistration />} />} />
              <Route path="/dayBook" element={<ProtectedRoute element={<DayBook />} />} />
              <Route path="/daybookreport" element={<ProtectedRoute element={<DayBookReport />} />} />
              <Route path="/jventry" element={<ProtectedRoute element={<JournalEntry />} />} />
              <Route path="/cventry" element={<ProtectedRoute element={<ContraEntry />} />} />
              <Route path="/ledgerdia" element={<ProtectedRoute element={<LedgerRepModel />} />} />
              <Route path="/ledgerreport" element={<ProtectedRoute element={<LedgerReport />} />} />
              <Route path="/qsearch" element={<ProtectedRoute element={<QuickSearch />} />} />
              <Route path="/agreport" element={<ProtectedRoute element={<AgentReport />} />} />
              <Route path="/agreportdia" element={<ProtectedRoute element={<AgentReportModel />} />} />
              <Route path="/smssettings" element={<ProtectedRoute element={<SmsSettings />} />} />






            </Routes>
          </Router>
        </DbProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
