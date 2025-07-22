import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'regenerator-runtime/runtime';
import './theme/variables.css';

import { ThemeProvider } from '@emotion/react';
import '@google/model-viewer';
import HeaderDesktop from './components/shared/Header/HeaderDesktop';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { getUserRole } from './services/axiosClient';
import './styles/global.css';
import fontTheme from './theme/fontTheme';

import { NotificationProvider } from './components/util/NotificationContext';
import './components/util/Service.css';
// import Letterhead from './components/util/Letterhead';

import SSORedirectHandler from './components/Authentication/SSORedirectHandler';
import { UserModuleRoleProvider } from './components/util/UserModuleRoleContext';
import BeyondResumeInterviewForm from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumeInterviewForm';
import BeyondResumeInterviewSuccess from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumeInterviewSuccess';
import BeyondResumePracticeInterviewForm from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumePracticeInterviewForm';
import BeyondResumePracticeInterviewSession from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumePracticeInterviewSession';
import BeyondResumeReadyToJoin from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumeReadyToJoin';
import BeyondResumeCandidateList from './pages/Beyond Resume/BeyondResumeCandidateList';
import BeyondResumeHome from './pages/Beyond Resume/BeyondResumeHome';
import BeyondResumeInterview from './pages/Beyond Resume/BeyondResumeInterview';
import BeyondResumeInterviewList from './pages/Beyond Resume/BeyondResumeInterviewList';
import BeyondResumeInterviewOverview from './pages/Beyond Resume/BeyondResumeInterviewOverview';
import BeyondResumeJobDetails from './pages/Beyond Resume/BeyondResumeJobDetails';
import BeyondResumeJobInterviewForm from './pages/Beyond Resume/BeyondResumeJobInterviewForm';
import BeyondResumeJobInterviewSession from './pages/Beyond Resume/BeyondResumeJobInterviewSession';
import BeyondResumeJobInterviewSessionWritten from './pages/Beyond Resume/BeyondResumeJobInterviewSessionWritten';
import BeyondResumeJobs from './pages/Beyond Resume/BeyondResumeJobs';
import BeyondResumePayment from './pages/Beyond Resume/BeyondResumePayment';
import BeyondResumePricing from './pages/Beyond Resume/BeyondResumePricing';
import CandidateProfilePage from './pages/Beyond Resume/BeyondResumeProfile/CandidateProfilePage';
import JobFitmentPage from './pages/Beyond Resume/BeyondResumeProfile/JobFitmentAnalysis';
import BeyondResumeQuestionBankForm from './pages/Beyond Resume/BeyondResumeQuestionBankForm';
import LayoutContainer from './components/Layout/LayoutContainer';
import { ThemeProviderCustom } from './components/util/ThemeContext';
import BeyondResumePracticeJobs from './pages/Beyond Resume/BeyondResumePracticeJobs';
import BeyondResumePartnerJobDetails from './pages/Beyond Resume/BeyondResumePartnerJobDetails';
// import { AvatarProvider } from './pages/Daily Education/Components/AvatarContext';
// import DailyEducationRegister from './pages/Daily Education/DailyEducationRegister';
// import MyTeamPerformance from './pages/MyTeamPerformance';
// import TeamPage from './pages/TeamPage';


const App: React.FC = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => setIsPageLoaded(true);

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);



  return (
      <ThemeProvider theme={fontTheme}>
          <BrowserRouter>
            <UserModuleRoleProvider>
              <NotificationProvider>
              {/* <AvatarProvider> */}
              <ThemeProviderCustom>
                
                <div style={{minHeight:'100vh',overflowY:'hidden'}}
            >
                <LayoutContainer>
                {/* <HeaderDesktop /> */}
                {/* <HeaderMob /> */}
                <Switch>

                <Route
                  exact
                  path="/"
                  render={({ location, history }) => {
                    const queryParams = new URLSearchParams(location.search);
                    const token = queryParams.get("token");
                    if (token) {
                      history.replace({
                        pathname: "/auth-callback",
                        search: `?token=${token}`,
                      });
                    }

                    return null; 
                  }}
                />

                  <Route path="/auth-callback" component={SSORedirectHandler} />

                  <ProtectedRoute path="/beyond-resume" component={BeyondResumeHome} />
                  <ProtectedRoute path="/beyond-resume-jobs" component={BeyondResumeJobs} />
                  <ProtectedRoute path="/beyond-resume-myjobs" component={BeyondResumeJobs} />
                  <ProtectedRoute path="/beyond-resume-practicePools" component={BeyondResumePracticeJobs} />
                  <ProtectedRoute path="/beyond-resume-jobdetails/:brJobId" component={BeyondResumeJobDetails} />
                  <ProtectedRoute path="/beyond-resume-jobedit/:brJobId" component={BeyondResumePartnerJobDetails} />
                  <ProtectedRoute path="/beyond-resume-interviews" component={BeyondResumeInterview} />
                  <ProtectedRoute path="/beyond-resume-interviewForm" component={BeyondResumeInterviewForm} />
                  <ProtectedRoute path="/beyond-resume-JobInterviewForm/:brJobId" component={BeyondResumeJobInterviewForm} />
                  <ProtectedRoute path="/beyond-resume-readyToJoin/:brJobId" component={BeyondResumeReadyToJoin} />

                  <ProtectedRoute path="/beyond-resume-jobInterviewSession/:brJobId" component={BeyondResumeJobInterviewSession} />
                  <ProtectedRoute path="/beyond-resume-jobInterviewSession-written/:brJobId" component={BeyondResumeJobInterviewSessionWritten} />
                  <ProtectedRoute path="/beyond-resume-practiceInterviewSession/:brJobId" component={BeyondResumePracticeInterviewSession} />
                  <ProtectedRoute path="/beyond-resume-interview-success" component={BeyondResumeInterviewSuccess} />
                  <ProtectedRoute path="/beyond-resume-interview-list" component={BeyondResumeInterviewList} />
                  <ProtectedRoute path="/beyond-resume-candidate-list" component={BeyondResumeCandidateList} />
                  <ProtectedRoute path="/beyond-resume-interview-overview/:id" component={BeyondResumeInterviewOverview} />
                  <ProtectedRoute path="/beyond-resume-candidate-profile" component={CandidateProfilePage} />
                  <ProtectedRoute path="/beyond-resume-pricing" component={BeyondResumePricing} /> 
                  <ProtectedRoute path="/beyond-resume-payment" component={BeyondResumePayment} /> 
                  <ProtectedRoute path="/beyond-resume-questionBankForm" component={BeyondResumeQuestionBankForm} /> 
                  <ProtectedRoute path="/beyond-resume-practiceInterviewForm/:brMockInterviewId" component={BeyondResumePracticeInterviewForm} /> 

                  <ProtectedRoute path="/beyond-resume-fitment-analysis" component={JobFitmentPage} />


              

                </Switch>
              </LayoutContainer>
                </div>
              </ThemeProviderCustom>
                
                
              {/* </AvatarProvider> */}

              </NotificationProvider>
              {/* </CartProvider> */}
            </UserModuleRoleProvider>
          </BrowserRouter>
        
      </ThemeProvider>
  );
};

export default App;
