import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function WaitlistDashboard() {
  let user = useSelector((state) => state.user);
  const isSupported = navigator.share;
  console.log(user);
  let UserLogs = user?.logs;
  let revLog = UserLogs ? [...UserLogs].reverse() : [];
  console.log(revLog);
  let count = 0;
  const allLogs = revLog?.map((items) => {
    let options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    var date = new Date(items.timestamp);
    let dateString = date.toLocaleDateString("en-GB", options);

    if(items.event === "referral")count+=1;
    return (
      <>
        <a className="rounded-sm w-1/2 my-3 grid grid-cols-12 bg-white dark:bg-gray-900 shadow px-10 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform">
          {/* Icon */}
          <div className="col-span-12 items-center justify-center flex flex-col md:col-span-1">
            {items.event === "referral" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                />
              </svg>
            )}
            {items.event === "fallback" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}

            <p className="text-xs">{dateString}</p>
          </div>

          {/* Title */}
          <div className="col-span-11 xl:-ml-5">
            <p className="text-blue-600 text-sm text-center font-semibold">
              {items.event === "referral" &&
                `you invited ${items.refId.name} and moved up by one point`}
            </p>
          </div>

          {/* Description */}
        </a>
      </>
    );
  });
  const handleClick = () => {
    // Call the share method with the data to share
    navigator
      .share({
        title: "Refer your friends",
        text: "Join the waitlist using the link below",
        url: `http://localhost:5173/referral/${user._id}`,
      })
      .then(() => {
        // Handle successful share
        console.log("Shared successfully");
      })
      .catch((error) => {
        // Handle unsuccessful share or error
        console.error("Something went wrong", error);
      });
  };
  const handleCopy = () => {
    // Write the referral link to the clipboard
    navigator.clipboard
      .writeText(`http://localhost:5173/referral/${user._id}`)
      .then(() => {
        // Handle successful copy
        MySwal.fire({
          title: <p>Copied!</p>,
          icon: "success",
          timer: 1500,
        });
      })
      .catch((error) => {
        // Handle unsuccessful copy or error
        console.error("Something went wrong", error);
      });
  };
  return (
    <>
      <div className="mt-10 text-black dark:text-white">
        <div className="flex justify-center gap-10 items-center md:w-full">
          <p className="px-7 rounnded border-4 w-full md:w-1/4 text-center dark:border-white py-10 bg-white dark:bg-black">
            <span className="font-bold">Hey {user && user?.name}, </span> Your
            Position is : {user && user?.position}
          </p>
          <p >
            {" "}
            {isSupported && (
              <>
                <p className="text-xs my-2">No of referrals : {count}</p>
                <button className="flex gap-2" onClick={handleClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                  Share the referal link
                </button>
                <button
                  className="bg-gray-400 p-1 my-3 rounded"
                  onClick={handleCopy}
                >
                  {`http://localhost:5173/referral/${user._id}`}{" "}
                  <button className="p-2 ml-2 bg-blue-gray-800 rounded">
                    Copy
                  </button>
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <section className="text-black dark:text-white bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl bg-white dark:bg-black border mt-10 px-4 pt-10 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-10">
          <div className="col-span-12 flex flex-col items-center justify-center">
            {allLogs ? allLogs : "no logs found"}
          </div>
        </div>
      </section>
    </>
  );
}

export default WaitlistDashboard;
