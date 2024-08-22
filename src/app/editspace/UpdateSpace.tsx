import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import PreviewBox from "../components/PreviewBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UpdateSpaceProps {
  id: string | undefined;
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_SPACENAME":
      return { ...state, spacename: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: !state.theme };
    case "CHANGE_IMAGE":
      return { ...state, image: action.payload };
    case "TOGGLE_STAR_RATINGS":
      return { ...state, starRatings: !state.starRatings };
    case "SET_EXTRA_INFORMATION":
      return { ...state, extraInformation: action.payload };
    case "SET_IMG":
      return { ...state, img: action.payload };
    case "SET_ALL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const UpdateSpace: React.FC<UpdateSpaceProps> = ({ id }) => {
  const { user } = useUser();
  let sub = user?.sub?.split("|")[1];
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const [state, dispatch] = React.useReducer(reducer, {
    spacename: "",
    title: "",
    message: "",
    theme: true,
    starRatings: false,
    image: user?.picture || "",
    extraInformation: [
      {
        text: "company",
        value: false,
        required: false,
      },
      {
        text: "socialLink",
        value: false,
        required: false,
      },
      {
        text: "Address",
        value: false,
        required: false,
      },
    ],
    img: "",
  });

  const [buttonColors] = React.useState({
    red: "#ff0000",
    blue: "#2563eb",
    green: "#10b981",
    yellow: "#f59e0b",
    pink: "#ec4899",
    purple: "#7c3aed",
    gray: "#020617",
  });

  const [chooseButtonColor, setChooseButtonColor] = React.useState(
    buttonColors.gray
  );
  const [selectExtraInformation, setSelectExtraInformation] =
    React.useState(false);
  const [questions, setQuestions] = React.useState([
    "Who are you / what are you working on?",
    "What is the best thing about [our product / service",
    "How has [our product / service] helped you?",
  ]);

  React.useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(`/api/getUpdatedSpace/${id}`);
        const spaceData = response.data.data;

        dispatch({ type: "SET_ALL", payload: spaceData });
        setQuestions(spaceData.questions);
        setChooseButtonColor(spaceData.buttonColor);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching space data:", error);
        setIsLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  const handleQuestions = (index: number, newValue: string) => {
    if (newValue.length <= 100) {
      const updatedQuestions = [...questions];
      updatedQuestions[index] = newValue;
      setQuestions(updatedQuestions);
    }
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAdd = () => {
    if (questions.length < 5) {
      setQuestions([...questions, ""]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = state.title.replace(/ /g, "_");
    const file = state.image;

    try {
      let imageUrl = state.image;

      if (file instanceof Blob) {
        const formData = new FormData();
        formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
        formData.append("image", file);

        const imgbbres = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData
        );

        imageUrl = imgbbres.data.data.display_url;
      }

      const data = {
        spacename: state.spacename,
        title: cleanTitle,
        message: state.message,
        theme: state.theme,
        starRatings: state.starRatings,
        buttonColor: chooseButtonColor,
        questions: questions,
        image: imageUrl,
        extraInformation: state.extraInformation,
      };

      const response = await axios.put("/api/updateSpace", {
        id: id,
        data: data,
      });

      console.log("Update Response:", response);

      // router.push(
      //   `/testimonial/${id}-${slugify(data.title, {
      //     lower: true,
      //     strict: true,
      //   })}`
      // );
      toast("Space updated successfully", {
        type: "success",
      });
    } catch (error) {
      console.error("Error updating space:", error);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  const imageSrc =
    state.image instanceof Blob
      ? URL.createObjectURL(state.image)
      : state.image;

  return (
    <div className="bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] bg-[size:24px_24px] min-h-screen flex items-center justify-center">
      <div className="w-3/4 mx-auto lg:justify-between justify-start shadow-md bg-[#141414] items-start py-5 my-5 rounded-xl relative flex px-4 lg:flex-row flex-col">
        <IoMdClose className="absolute top-4 right-6 text-gray-400" />

        {/* Preview box */}
        <div className="flex px-4 py-5 lg:mt-10 w-full lg:w-1/2 flex-col">
          <h1 className="text-2xl text-gray-100 font-semibold text-center">
            Preview
          </h1>

          <PreviewBox
            title={state.title}
            message={state.message}
            theme={state.theme}
            ratings={state.starRatings}
            questions={questions}
            buttonColor={chooseButtonColor}
            image={state.image}
            initialImage={user?.picture ?? ""}
          />
        </div>

        {/* Update Space form */}
        <div className="flex justify-start items-start px-4 py-5 lg:mt-10 flex-col w-full lg:w-2/3">
          <h1 className="text-2xl text-gray-100 font-semibold text-left lg:text-center">
            Update Space
          </h1>

          <form
            className="w-full lg:mt-6 mt-2 flex flex-col"
            onSubmit={handleUpdate}
          >
            {/* Add form fields similar to the create space form, but populated with state values */}
            {/* For example: */}
            <div className="mb-5">
              <label
                htmlFor="spacename"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Space Name
              </label>
              <input
                type="text"
                id="spacename"
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#222222] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={state.spacename}
                onChange={(e) =>
                  dispatch({ type: "SET_SPACENAME", payload: e.target.value })
                }
                required
              />
            </div>

            {/* Add more form fields for title, message, image, etc. */}
            <div className="flex items-center">
              {/* {user?.picture && (
                  <img
                    src={user.picture}
                    alt="profile"
                    className="rounded-full w-12 h-12"
                  />
                )} */}
              {imageSrc && (
                <img
                  src={imageSrc ?? ""}
                  alt="profile"
                  className="rounded-full w-12 h-12 object-cover"
                />
              )}
              {/* <LazyLoadedImage id={null} initialImage={spaceData.image} /> */}
              <span className="ml-5 rounded-md shadow-sm">
                <input
                  type="file"
                  id="newLogoURL"
                  className="hidden"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    dispatch({
                      type: "CHANGE_IMAGE",
                      payload: e.target.files?.[0],
                    });
                  }}
                />
                <label
                  htmlFor="newLogoURL"
                  className="py-2 px-3 bg-gray-800 text-gray-100 rounded-md transition duration-150 ease-in-out cursor-pointer"
                >
                  Change
                </label>
              </span>
            </div>

            <div className="mb-5">
              <label
                htmlFor="header-title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Header Title
              </label>
              <input
                type="text"
                id="header-title"
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#222222] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                autoComplete="off"
                value={state.title.split("_").join(" ")}
                onChange={(e) => {
                  dispatch({ type: "SET_TITLE", payload: e.target.value });
                }}
              />
            </div>

            {/* Questions */}
            <div className="mb-5">
              <label
                htmlFor="questions"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Questions
              </label>
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-3 mb-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleQuestions(index, e.target.value)}
                    className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#222222] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <RiDeleteBin5Line
                    className="text-gray-200 cursor-pointer"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              ))}
              <div className="flex items-center space-x-3">
                <CiCirclePlus
                  className="text-gray-100 font-semibold cursor-pointer"
                  onClick={handleAdd}
                />
                <span className="text-gray-100 text-sm">Add one (up to 5)</span>
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="custom-message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Custom Message
              </label>
              <textarea
                id="custom-message"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#222222] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 lg:h-[6rem]"
                required
                value={state.message}
                onChange={(e) => {
                  dispatch({ type: "SET_MESSAGE", payload: e.target.value });
                }}
              />
            </div>

            <div className="flex space-x-6  mb-4 flex-col xl:flex-col  md:flex-row  flex-wrap lg:flex-row">
              <div className="relative inline-block text-left">
                <label
                  htmlFor="star-ratings"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Collect extra information
                </label>
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5   px-3 py-2 text-sm font-semibold bg-gray-50  border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-[#222222]  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() =>
                      setSelectExtraInformation(!selectExtraInformation)
                    }
                  >
                    Title, social link
                    <svg
                      className="-mr-1 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {selectExtraInformation && (
                  <div
                    className="absolute left-0 z-10 mt-2 lg:w-96 origin-top-right rounded-md  shadow-lg    text-gray-900     dark:placeholder-gray-400 dark:text-white focus:outline-none "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    {/* left side of the line  */}
                    <div className="py-1 mb-2 lg:mb-0" role="none">
                      {state.extraInformation.map((item: any, index: any) => (
                        <>
                          <div
                            className={`flex justify-between ${
                              index % 2 === 0 ? "bg-gray-800 " : "bg-[#222222]"
                            }`}
                          >
                            <div
                              key={index}
                              className="flex items-center justify-between px-4 py-2 space-x-4"
                            >
                              <label className="flex cursor-pointer select-none items-center">
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only"
                                    checked={item.value}
                                    onChange={() => {
                                      const updated =
                                        state.extraInformation.map(
                                          (info: any, i: any) => {
                                            if (index === i) {
                                              return {
                                                ...info,
                                                value: !info.value,
                                              };
                                            }
                                            return info;
                                          }
                                        );
                                      dispatch({
                                        type: "SET_EXTRA_INFORMATION",
                                        payload: updated,
                                      });
                                    }}
                                  />
                                  <div
                                    className={`block h-8 w-14 rounded-full transition ${
                                      item.value
                                        ? "bg-blue-600"
                                        : "bg-[#E5E7EB]"
                                    }`}
                                  ></div>
                                  <div
                                    className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform ${
                                      item.value ? "translate-x-full" : ""
                                    }`}
                                  >
                                    <span
                                      className={`absolute inset-0 flex items-center justify-center ${
                                        item.value ? "active" : "inactive"
                                      }`}
                                    >
                                      {item.value ? (
                                        <svg
                                          width="11"
                                          height="8"
                                          viewBox="0 0 11 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                            fill="white"
                                            stroke="white"
                                            strokeWidth="0.4"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          className="h-4 w-4 stroke-current"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                          ></path>
                                        </svg>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </label>

                              <h1 className="text-gray-900 dark:text-white text-sm">
                                {item.text}
                              </h1>
                            </div>

                            {/* right side of line  */}
                            <div className="flex justify-center items-center lg:mr-8 mr-2 space-x-3">
                              <h1>required? </h1>
                              <input
                                type="checkbox"
                                value=""
                                className=""
                                checked={item.required}
                                onChange={() => {
                                  const updated = state.extraInformation.map(
                                    (info: any, i: any) => {
                                      if (index === i) {
                                        const updatedInfo = {
                                          ...info,
                                          required: !info.required,
                                        };
                                        if (updatedInfo.required) {
                                          updatedInfo.value = true;
                                        }
                                        return updatedInfo;
                                      }

                                      return info;
                                    }
                                  );
                                  dispatch({
                                    type: "SET_EXTRA_INFORMATION",
                                    payload: updated,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="star-ratings"
                  className="block  text-sm font-medium text-gray-900 dark:text-white mt-2 mb-2 lg:mt-0 "
                >
                  Collect star ratings
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="star-ratings"
                    value={state.starRatings}
                    onChange={(e) => {
                      dispatch({ type: "TOGGLE_STAR_RATINGS" });
                    }}
                    className="sr-only peer"
                  />
                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-[#222222] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label
                  htmlFor="choose-theme"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Choose Theme
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="choose-theme"
                    value={state.theme}
                    onChange={() => dispatch({ type: "TOGGLE_THEME" })}
                    className="sr-only peer"
                  />
                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-[#222222] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Add more form fields and controls as needed */}

            <label
              htmlFor="cta"
              className="block  text-sm font-medium text-gray-900 dark:text-white"
            >
              Customize button color
            </label>

            <div className="flex flex-wrap mb-2">
              {Object.values(buttonColors).map((item: any) => {
                return (
                  <div
                    key={item}
                    className="flex items-center space-x-2 space-y-4"
                  >
                    <input
                      type="radio"
                      name="button-color"
                      id={item}
                      value={state.buttonColor}
                      className="sr-only"
                      onChange={() => setChooseButtonColor(item)}
                    />
                    <label
                      htmlFor={item}
                      className="cursor-pointer w-10 h-10 rounded-md"
                      style={{ backgroundColor: item }}
                    ></label>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update Space
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSpace;
