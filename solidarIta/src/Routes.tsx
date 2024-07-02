import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SidebarWithHeader from "./components/SidebarHeader/index";
import { AuthContext } from "./contexts/AuthContext";
import AccountabilityCampain from "./pages/Accountability";
import ApprovedPage from "./pages/Aprroved";
import ApprovedVolunteerPage from "./pages/AprrovedVolunteer";
import { CampaignDonation } from "./pages/Campaign/Donation";
import { CampaignGroceryList } from "./pages/Campaign/GroceryList";
import { DetailsCampaign } from "./pages/Campaign/GroceryList/Details";
import { CampaignVolunteer } from "./pages/Campaign/Volunteer";
import CreateDonationCampaign from "./pages/DonationCampaign/CreateDonationCampaign";
import CreateGroceryList from "./pages/GroceryLists/CreateGroceryList";
import CreateVolunteerCampaign from "./pages/VolunteerCampaign/CreateVolunteerCampain";
import DonationCampaign from "./pages/DonationCampaign";
import { DonationCampaignAccountability } from "./pages/Campaign/Donation/Accountability";
import { Feed } from "./pages/Feed";
import GroceryList from "./pages/GroceryLists";
import { GroceryListAccountability } from "./pages/Campaign/GroceryList/Accountability";
import { GroceryListEdit } from "./pages/GroceryLists/Edit";
import { GroceryListLog } from "./pages/GroceryLists/Log";
import { GroceryListNew } from "./pages/GroceryLists/New";
import HistoryUser from "./pages/historyCampainUser";
import { AllActivitiesUser } from "./pages/historyCampainUser/AllActivitiesUser";
import Login from "./pages/Login/index";
import Orders from "./pages/Orders";
import { AwaitingDeliveryOrders } from "./pages/Orders/AwaitingDelivery";
import { FinishedOrders } from "./pages/Orders/Finished";
import { InProgressOrders } from "./pages/Orders/InProgress";
import { PendingOrders } from "./pages/Orders/Pending";
import Pagina404 from "./pages/Page404";
import PendingUser from "./pages/PendingUser";
import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductList/Modal/Create-update";
import ProductsList from "./pages/Products";
import Profile from "./pages/Profile";
import UserRanking from "./pages/Ranking";
import UserRegistration from "./pages/UserRegistration";
import { UsersList } from "./pages/UsersList";
import UsersDetail from "./pages/UsersList/UsersDetail";
import AccountsPendingPage from "./pages/verifyAccounts";
import VolunteerCampaign from "./pages/VolunteerCampaign";
import { VolunteerCampaignAccountability } from "./pages/Campaign/Volunteer/Accountability";

//FUNÇÃO QUE VERIFICA AS ROTAS PRIVADAS
function RequireAuth({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) {
  const { isAuthenticated, rolesUser } = useContext(AuthContext);

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (!(rolesUser.includes(role) || role === "feed")) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

//FUNÇÃO QUE VERIFICA AS ROTAS Publicas
function RequireWithoutAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === true) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

export function Routess() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/"
        element={
          <RequireWithoutAuth>
            <Login />
          </RequireWithoutAuth>
        }
      />
      <Route
        path="/login"
        element={
          <RequireWithoutAuth>
            <Login />
          </RequireWithoutAuth>
        }
      />
      <Route
        path="/register"
        element={
          <RequireWithoutAuth>
            <UserRegistration />
          </RequireWithoutAuth>
        }
      />

      {/* ROTAS PRIVADAS */}
      <Route
        path="/accountability/campains"
        element={
          <RequireAuth role="accountability">
            <SidebarWithHeader>
              <AccountabilityCampain />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/accounts/verify"
        element={
          <RequireAuth role="verifyAccount">
            <SidebarWithHeader>
              <AccountsPendingPage />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/donation/Accountability/:donationCampaignId"
        element={
          <RequireAuth role="accountability">
            <SidebarWithHeader>
              <CampaignDonation finished={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/donation/detail/:donationCampaignId"
        element={
          <RequireAuth role="campaignsDetail">
            <SidebarWithHeader>
              <CampaignDonation finished={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/donation/view/:donationCampaignId"
        element={
          <RequireAuth role="historyUser">
            <SidebarWithHeader>
              <CampaignDonation history={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/donation/:donationCampaignId"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <CampaignDonation />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/groceryList/Accountability/:groceryListId"
        element={
          <RequireAuth role="accountability">
            <SidebarWithHeader>
              <CampaignGroceryList finished={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/groceryList/detail/:groceryListId"
        element={
          <RequireAuth role="campaignsDetail">
            <SidebarWithHeader>
              <DetailsCampaign />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/groceryList/view/:groceryListId"
        element={
          <RequireAuth role="historyUser">
            <SidebarWithHeader>
              <CampaignGroceryList history={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/groceryList/:groceryListId"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <CampaignGroceryList />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/volunteer/Accountability/:volunteerCampaignId"
        element={
          <RequireAuth role="accountability">
            <SidebarWithHeader>
              <CampaignVolunteer finished={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/volunteer/detail/:groceryListId"
        element={
          <RequireAuth role="campaignsDetail">
            <SidebarWithHeader>
              <CampaignVolunteer />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/volunteer/view/:volunteerCampaignId"
        element={
          <RequireAuth role="historyUser">
            <SidebarWithHeader>
              <CampaignVolunteer history={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/campaign/volunteer/:volunteerCampaignId"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <CampaignVolunteer />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donationCampaign/accountability/:donationCampaignId"
        element={
          <RequireAuth role="donationCampaign">
            <SidebarWithHeader>
              <DonationCampaignAccountability />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donationCampaign/all"
        element={
          <RequireAuth role="donationCampaign">
            <SidebarWithHeader>
              <DonationCampaign />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donationCampaign/create"
        element={
          <RequireAuth role="createDonationCampaign">
            <SidebarWithHeader>
              <CreateDonationCampaign edit={false} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donationCampaign/edit/:donationCampaignId"
        element={
          <RequireAuth role="donationCampaign">
            <SidebarWithHeader>
              <CreateDonationCampaign edit={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donationCampaign/log/:donationCampaignId"
        element={
          <RequireAuth role="donationCampaign">
            <SidebarWithHeader>
              <CampaignDonation log={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/donors/all"
        element={
          <RequireAuth role="usersList">
            <SidebarWithHeader>
              <UsersList type={1} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/feed"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <Feed />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/feed/institution/:id"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <Feed user_type={2} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/feed/partner/:id"
        element={
          <RequireAuth role="feed">
            <SidebarWithHeader>
              <Feed user_type={3} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/accountability/:groceryListId"
        element={
          <RequireAuth role="groceryList">
            <SidebarWithHeader>
              <GroceryListAccountability />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/all"
        element={
          <RequireAuth role="groceryList">
            <SidebarWithHeader>
              <GroceryList />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/create/header"
        element={
          <RequireAuth role="createGroceryList">
            <SidebarWithHeader>
              <CreateGroceryList step={1} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/create/partners"
        element={
          <RequireAuth role="createGroceryList">
            <SidebarWithHeader>
              <CreateGroceryList step={2} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/create/products/:partner"
        element={
          <RequireAuth role="createGroceryList">
            <SidebarWithHeader>
              <CreateGroceryList step={3} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/edit/:groceryListId"
        element={
          <RequireAuth role="groceryList">
            <SidebarWithHeader>
              <GroceryListEdit />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/log/:groceryListId"
        element={
          <RequireAuth role="groceryList">
            <SidebarWithHeader>
              <GroceryListLog />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/groceryList/new/:groceryListId"
        element={
          <RequireAuth role="groceryList">
            <SidebarWithHeader>
              <GroceryListNew />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/history/campains"
        element={
          <RequireAuth role="historyUser">
            <SidebarWithHeader>
              <HistoryUser />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/institutions/all"
        element={
          <RequireAuth role="usersList">
            <SidebarWithHeader>
              <UsersList type={2} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/orders"
        element={
          <RequireAuth role="orders">
            <SidebarWithHeader>
              <Orders />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/orders/awaitingDelivery/:groceryListId"
        element={
          <RequireAuth role="orders">
            <SidebarWithHeader>
              <AwaitingDeliveryOrders />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/orders/finished/:groceryListId"
        element={
          <RequireAuth role="orders">
            <SidebarWithHeader>
              <FinishedOrders />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/orders/inProgress/:groceryListId"
        element={
          <RequireAuth role="orders">
            <SidebarWithHeader>
              <InProgressOrders />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/orders/pending/:groceryListId"
        element={
          <RequireAuth role="orders">
            <SidebarWithHeader>
              <PendingOrders />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/partners/all"
        element={
          <RequireAuth role="usersList">
            <SidebarWithHeader>
              <UsersList type={3} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/product/add"
        element={
          <RequireAuth role="productAdd">
            <SidebarWithHeader>
              <ProductAdd />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />
      <Route
        path="/product/list"
        element={
          <RequireAuth role="productList">
            <SidebarWithHeader>
              <ProductList />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/products/:id"
        element={
          <RequireAuth role="usersList">
            <SidebarWithHeader>
              <ProductsList />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth role="profile">
            <SidebarWithHeader>
              <Profile />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      {/* <Route
        path="/ranking"
        element={
          <RequireAuth role="ranking">
            <SidebarWithHeader>
              <UserRanking />
            </SidebarWithHeader>
          </RequireAuth>
        }
      /> */}

      <Route
        path="/user/activities/:id"
        element={
          <RequireAuth role="usersActivities">
            <SidebarWithHeader>
              <AllActivitiesUser />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/user/detail/:id"
        element={
          <RequireAuth role="usersDetail">
            <SidebarWithHeader>
              <UsersDetail />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/volunteerCampaign/accountability/:volunteerCampaignId"
        element={
          <RequireAuth role="volunteerCampaign">
            <SidebarWithHeader>
              <VolunteerCampaignAccountability />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/volunteerCampaign/all"
        element={
          <RequireAuth role="volunteerCampaign">
            <SidebarWithHeader>
              <VolunteerCampaign />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/volunteerCampaign/create"
        element={
          <RequireAuth role="createVolunteerCampaign">
            <SidebarWithHeader>
              <CreateVolunteerCampaign edit={false} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/volunteerCampaign/edit/:volunteerCampaignId"
        element={
          <RequireAuth role="volunteerCampaign">
            <SidebarWithHeader>
              <CreateVolunteerCampaign edit={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route
        path="/volunteerCampaign/log/:volunteerCampaignId"
        element={
          <RequireAuth role="volunteerCampaign">
            <SidebarWithHeader>
              <CampaignVolunteer log={true} />
            </SidebarWithHeader>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Pagina404 />} />
      <Route path="/approved" element={<ApprovedPage />} />
      <Route path="/approvedVolunteer" element={<ApprovedVolunteerPage />} />
      <Route path="/pendingUser" element={<PendingUser />} />
    </Routes>
  );
}
