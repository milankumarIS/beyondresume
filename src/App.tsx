import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import 'regenerator-runtime/runtime';
import './theme/variables.css';

import { ThemeProvider } from '@emotion/react';
import '@google/model-viewer';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import './styles/global.css';
import fontTheme from './theme/fontTheme';

import { NotificationProvider } from './components/context/NotificationContext';
import './components/util/Service.css';
// import Letterhead from './components/util/Letterhead';

import SSORedirectHandler from './components/Authentication/SSORedirectHandler';
import LayoutContainer from './components/Layout/LayoutContainer';
import { IndustryProvider } from './components/context/IndustryContext';
import { ThemeProviderCustom } from './components/context/ThemeContext';
import { UserDataProvider } from './components/context/UserDataContext';
import { UserModuleRoleProvider } from './components/context/UserModuleRoleContext';
import BeyondResumeJobInterviewForm from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Job Apply/BeyondResumeJobInterviewForm';
import BeyondResumeJobInterviewSession from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Job Apply/BeyondResumeJobInterviewSession';
import BeyondResumeJobInterviewSessionWritten from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Job Apply/BeyondResumeJobInterviewSessionWritten';
import JobFitmentPage from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Job Apply/JobFitmentAnalysis';
import BeyondResumeInterviewForm from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Practice Interview/BeyondResumeCreatePracticeInterviewForm';
import BeyondResumePracticeInterviewForm from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Practice Interview/BeyondResumePracticeInterviewForm';
import BeyondResumePracticeInterviewSession from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Practice Interview/BeyondResumePracticeInterviewSession';
import BeyondResumePracticeJobs from './pages/Beyond Resume/Beyond Resume Carrer Seeker/Beyond Resume Practice Interview/BeyondResumePracticeJobs';
import BeyondResumeApplications from './pages/Beyond Resume/Beyond Resume Carrer Seeker/BeyondResumeApplications';
import BeyondResumeInterviewList from './pages/Beyond Resume/Beyond Resume Carrer Seeker/BeyondResumeInterviewList';
import BeyondResumeInterviewOverview from './pages/Beyond Resume/Beyond Resume Carrer Seeker/BeyondResumeInterviewOverview';
import BeyondResumeInterviewSuccess from './pages/Beyond Resume/Beyond Resume Components/BeyondResumeInterviewSuccess';
import BeyondResumePractice from './pages/Beyond Resume/Beyond Resume Interview/BeyondResumePractice';
import BeyondResumePayment from './pages/Beyond Resume/Beyond Resume Payments/BeyondResumePayment';
import BeyondResumePricing from './pages/Beyond Resume/Beyond Resume Payments/BeyondResumePricing';
import BeyondResumeJobPost from './pages/Beyond Resume/Beyond Resume Talent Partner/Beyond Resume Job Post/BeyondResumeJobPost';
import BeyondResumeCandidateList from './pages/Beyond Resume/Beyond Resume Talent Partner/BeyondResumeCandidateList';
import BeyondResumePartnerJobDetails from './pages/Beyond Resume/Beyond Resume Talent Partner/BeyondResumePartnerJobDetails';
import CompanyProfileForm from './pages/Beyond Resume/BeyondResumeCompanyProfile/CompanyProfileForm';
import { CompanyProfilePage } from './pages/Beyond Resume/BeyondResumeCompanyProfile/CompanyProfilePage';
import BeyondResumeHome from './pages/Beyond Resume/BeyondResumeHome';
import BeyondResumeJobDetails from './pages/Beyond Resume/BeyondResumeJobDetails';
import BeyondResumeJobs from './pages/Beyond Resume/BeyondResumeJobs';
import CandidateProfilePage from './pages/Beyond Resume/BeyondResumeProfile/CandidateProfilePage';
import BeyondResumePublicJobDetails from './pages/Beyond Resume/BeyondResumePublicJobDetails';
import BeyondResumeQuestionBankForm from './pages/Beyond Resume/BeyondResumeQuestionBankForm';
import BeyondResumeReadyToJoin from './pages/Beyond Resume/BeyondResumeReadyToJoin';
import { RoundProvider } from './components/context/RoundContext';
import { JobProvider } from './components/context/JobContext';
// import { AvatarProvider } from './pages/Daily Education/Components/AvatarContext';

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

  const ScrollToTopPage = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };


  return (
      <ThemeProvider theme={fontTheme}>
          <BrowserRouter>
            <UserModuleRoleProvider>
              <NotificationProvider>
              {/* <AvatarProvider> */}
              <ThemeProviderCustom>
              <IndustryProvider>
              <JobProvider>
              <RoundProvider>


              <ScrollToTopPage />


                <div style={{minHeight:'100vh',overflowY:'hidden'}}>
                <LayoutContainer>
                {/* <HeaderDesktop /> */}
                {/* <HeaderMob /> */}
                <Switch>

                <Route path="/beyond-resume-publicjobdetails" component={BeyondResumePublicJobDetails} />


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

                 <UserDataProvider>

                  

                  <ProtectedRoute path="/beyond-resume" component={BeyondResumeHome} />
                  <ProtectedRoute path="/beyond-resume-jobpost" component={BeyondResumeJobPost} />
                  <ProtectedRoute path="/beyond-resume-jobs" component={BeyondResumeJobs} />
                  <ProtectedRoute path="/beyond-resume-myjobs" component={BeyondResumeJobs} />
                  <ProtectedRoute path="/beyond-resume-practicePools" component={BeyondResumePracticeJobs} />
                  <ProtectedRoute path="/beyond-resume-myjobs-jobdetails/:brJobId" component={BeyondResumeJobDetails} />
                  <ProtectedRoute path="/beyond-resume-jobdetails/:brJobId" component={BeyondResumeJobDetails} />
                  <ProtectedRoute path="/beyond-resume-applicationJD/:brJobId" component={BeyondResumeJobDetails} />
                  <ProtectedRoute path="/beyond-resume-jobedit/:token" component={BeyondResumePartnerJobDetails} />
                  <ProtectedRoute path="/beyond-resume-practice" component={BeyondResumePractice} />
                  <ProtectedRoute path="/beyond-resume-interviewForm" component={BeyondResumeInterviewForm} />
                  <ProtectedRoute path="/beyond-resume-JobInterviewForm/:brJobId" component={BeyondResumeJobInterviewForm} />
                  <ProtectedRoute path="/beyond-resume-readyToJoin/:brJobId" component={BeyondResumeReadyToJoin} />

                  <ProtectedRoute path="/beyond-resume-jobInterviewSession/:token" component={BeyondResumeJobInterviewSession} />
                  <ProtectedRoute path="/beyond-resume-jobInterviewSession-written/:token" component={BeyondResumeJobInterviewSession} />
                  <ProtectedRoute path="/beyond-resume-practiceInterviewSession/:token" component={BeyondResumePracticeInterviewSession} />
                  <ProtectedRoute path="/beyond-resume-interview-success" component={BeyondResumeInterviewSuccess} />
                  <ProtectedRoute path="/beyond-resume-jobApplications" component={BeyondResumeApplications} />
                  <ProtectedRoute path="/beyond-resume-interview-list" component={BeyondResumeInterviewList} />
                  <ProtectedRoute path="/beyond-resume-candidate-list" component={BeyondResumeCandidateList} />
                  <ProtectedRoute path="/beyond-resume-interview-overview/:id" component={BeyondResumeInterviewOverview} />
                  <ProtectedRoute path="/beyond-resume-candidate-profile" component={CandidateProfilePage} />
                  <ProtectedRoute path="/beyond-resume-company-profile" component={CompanyProfilePage} />
                  <ProtectedRoute path="/beyond-resume-company-profile-form" component={CompanyProfileForm} />
                  <ProtectedRoute path="/beyond-resume-pricing" component={BeyondResumePricing} /> 
                  <ProtectedRoute path="/beyond-resume-payment" component={BeyondResumePayment} /> 
                  <ProtectedRoute path="/beyond-resume-questionBankForm" component={BeyondResumeQuestionBankForm} /> 
                  <ProtectedRoute path="/beyond-resume-practiceInterviewForm/:brMockInterviewId" component={BeyondResumePracticeInterviewForm} /> 

                  <ProtectedRoute path="/beyond-resume-fitment-analysis" component={JobFitmentPage} />
                 </UserDataProvider>

              </Switch>
              </LayoutContainer>
              </div>

              </RoundProvider>
              </JobProvider>
              </IndustryProvider>
              </ThemeProviderCustom>
                
              </NotificationProvider>
            </UserModuleRoleProvider>
          </BrowserRouter>
        
      </ThemeProvider>
  );
};

export default App;
