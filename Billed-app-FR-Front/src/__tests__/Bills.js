/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor,act } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { waitForElementToBeRemoved } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from '../__mocks__/store.js';


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toHaveClass("active-icon");
    });

    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const dates = screen
        .queryAllByTestId("bill-date")
        .map((a) => a.innerHTML);

      if (dates.length > 1) {
        const antiChrono = (a, b) => (a < b ? 1 : -1);
        const datesSorted = [...dates].sort(antiChrono);

        console.log("Actual dates:", dates);
        console.log("Sorted dates:", datesSorted);
        console.log(
          "Is the array sorted correctly?",
          dates.toString() === datesSorted.toString()
        );

        expect(dates).toEqual(datesSorted);
      } else {
        // Log or handle the case where no dates are found
        console.log("No dates found.");
      }
    });

    // test("Then bills should be ordered from earliest to latest", () => {
    //   document.body.innerHTML = BillsUI({ data: bills })
    //   const dates = screen.getAllByTestId(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
    //   const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    //   const datesSorted = [...dates].sort(antiChrono)
    //   expect(dates).toEqual(datesSorted)
    // })

    //code ajouté

    test("Then handleClickNewBill should call onNavigate with the correct route", () => {
      // Mock the onNavigate function
      const onNavigate = jest.fn();

      // Create a new instance of the Bills class
      const billsInstance = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: bills.store,
        localStorage: localStorageMock,
      });

      // Simulate click on the "New bill" button
      billsInstance.handleClickNewBill();

      // Check that the onNavigate function was called with the correct route
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill);
    });

    test("Then handleClickIconEye should handle click on eye icon and display the modal", async () => {
      //start DOM simulation
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH({ pathname });
      };
      const store = null;
      const bill = new Bills({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });

      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(bill.handleClickIconEye);
      const iconEye = screen.getAllByTestId("icon-eye");
      const modale = document.getElementById("modaleFile");
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => handleClickIconEye(icon));
        userEvent.click(icon);
        //tests
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(modale).toBeTruthy();
      });
    });

    test("Then the user can see all of his bills displayed", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH({ pathname });
      };
    
      const store = mockStore;
      const billsInstance = new Bills({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });
    
      const bills = await billsInstance.getBills();
      const billsLength = bills.length;
    
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
    
      router();
    
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
    
      // Wait for the bill cards to be rendered
      await waitFor(() => screen.getByTestId("tbody"));
    
     
const tbody = screen.getByTestId("tbody");
const allBills = tbody.querySelectorAll("tr"); 

expect(allBills.length).toBe(billsLength);

    });




  });
});

