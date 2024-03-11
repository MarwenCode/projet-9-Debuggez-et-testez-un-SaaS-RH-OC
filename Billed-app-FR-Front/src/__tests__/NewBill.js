/**
 * @jest-environment jsdom
 */

// import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import { fireEvent, screen, waitFor, act } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { waitForElementToBeRemoved } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store.js";
import Store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then email icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);
      //test
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon.getAttribute("class")).toContain("active-icon");
    });

    test("Then the input file should display the file name", () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const fileInput = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      fileInput.addEventListener("change", handleChangeFile);

      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["image.png"], "image.png", {
              type: "image/png",
            }),
          ],
        },
      });
      expect(fileInput.files[0].name).toBe("image.png");
      expect(handleChangeFile).toHaveBeenCalled();
    });


    test('should create a new bill for files with valid extensions', async () => {
      // Create a mock function with jest.fn() method
      const onNavigate = jest.fn()
      const newBillInstance = new NewBill({ document, onNavigate,   store: mockStore, })
      const fileInput = newBillInstance.document.querySelector('input[data-testid="file"]')
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test file content'], 'test.jpg', { type: 'image/jpeg' })]
        }
      });
      const fileUrl = await newBillInstance.store.bills().create();
      expect(fileUrl).toBeDefined();
    })

    test("fetches bills from mock API POST", async () => {
      //mock function to track calls to mocked store
      const postTrack = jest.spyOn(mockStore, "bills");
      //call POST function
      const billIsCreated = await postTrack().update();
      //tests
      expect(postTrack).toHaveBeenCalledTimes(1);
      expect(billIsCreated.id).toBe("47qAXb6fIm2zOKkLzMro");
    });
  });

  //test Post new Bill

  test('then a bill is created', () => {
    //environment simulation
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee',
      })
    );

    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    const submit = screen.getByTestId('form-new-bill');
    submit.addEventListener('submit', handleSubmit);
    fireEvent.submit(submit);
    expect(handleSubmit).toHaveBeenCalled();

    const dataCreated = jest.spyOn(mockStore.bills(), "create");
    const bill = {
      name: "Facture",
      date: "2023-09-19",
      type: "Vol",
      amount: 150,
      pct: 20,
      vat: "30",
      fileName: "test.jpg",
      fileUrl: "https://test.jpg",
      commentary: "Test bill",
    };
    mockStore.bills().create(bill);

    expect(dataCreated).toHaveBeenCalled();
  });

  



});










// test("Then it should create a new bill", async () => {
  //   window.localStorage.setItem(
  //     "user",
  //     JSON.stringify({ type: "Employee", email: "a@a", status: "connected" })
  //   );
  //   const root = document.createElement("div");
  //   root.setAttribute("id", "root");
  //   document.body.append(root);
  //   router();
  //   window.onNavigate(ROUTES_PATH.NewBill);

  //   const dataCreated = jest.spyOn(mockStore.bills(), "create");
  //   const bill = {
  //     name: "Facture",
  //     date: "2023-09-19",
  //     type: "Vol",
  //     amount: 150,
  //     pct: 20,
  //     vat: "30",
  //     fileName: "test.jpg",
  //     fileUrl: "https://test.jpg",
  //     commentary: "Test bill",
  //   };
  //   await mockStore.bills().create(bill);

  //   expect(dataCreated).toHaveBeenCalled();
  // });