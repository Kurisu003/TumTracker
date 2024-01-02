import { getAuth } from "firebase/auth";
import { useState } from "react";
import { updateOrCreateUserData } from "./TsFiles/databaseinteraction";
import { Status, SubjectData, UserData } from "./TsFiles/types";

function Weektable(props: {
    forceUpdate: Function;
    subjectData: SubjectData;
    userData: UserData;
}) {
    const auth = getAuth();
    // const [currentNotes, setCurrentNotes] = useState<string>("");

    function formatDate(date: Date) {
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month =
            date.getMonth() + 1 < 10
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1;

        return `${day}/${month}`;
    }

    let weeks = [
        ...new Set(
            props.subjectData.GU.map((item) => item.Week).concat(
                props.subjectData.ZU.map((item) => item.Week)
            )
        ),
    ];
    const dateObjects = weeks.map((dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        // Months are zero-based in JavaScript Dates, so we subtract 1 from the month
        return new Date(2000 + year, month - 1, day);
    });

    // Sort Date objects
    dateObjects.sort((a, b) => a.getTime() - b.getTime());

    // showUpdateStatus is either "" or the string of an id
    // its hidden if its "" and shown if anything else
    // uses id to update that item
    const [showUpdateStatus, setShowUpdateStatus] = useState<string>("");
    function handleStatusChange(Id: string) {
        setShowUpdateStatus(Id);
    }

    async function updateStatusDb(status: Status) {
        await updateOrCreateUserData(
            auth.currentUser?.displayName ?? "",
            showUpdateStatus,
            status,
            // currentNotes
            ""
        );
        setShowUpdateStatus("");
        props.forceUpdate(true);
    }

    const statusEmojiLookup: Record<Status, string> = {
        great: "😁",
        good: "😀",
        ok: "😐",
        bad: "🙁",
        horrible: "😭",
        not_done: "",
        not_availible: "",
    };

    return (
        <>
            {showUpdateStatus !== "" ? (
                <div className="UpdateStatusOverlay">
                    <h1
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() => {
                            setShowUpdateStatus("");
                        }}
                    >
                        X
                    </h1>
                    <h1>Change status of {showUpdateStatus}</h1>
                    <div className="StatusOptionsContainer">
                        {["great", "good", "ok", "bad", "horrible"].map(
                            (el) => {
                                return (
                                    <h1
                                        onClick={() => {
                                            updateStatusDb(el as Status);
                                        }}
                                        className={el}
                                    >
                                        {el} - {statusEmojiLookup[el as Status]}
                                    </h1>
                                );
                            }
                        )}
                    </div>
                    {/* <TextField
                        style={{}}
                        className="TextField"
                        id="outlined-textarea-email"
                        placeholder="Notes"
                        label="Notes"
                        margin="none"
                        minRows={1}
                        maxRows={1}
                        value={currentNotes}
                        onChange={(e: any) => setCurrentNotes(e.target.value)}
                    /> */}
                </div>
            ) : null}
            <table className="WeekDisplayTable">
                <thead>
                    <tr>
                        <th>Woche</th>
                        <th key={"Gu"}>Tutorium</th>
                        <th key={"Gu"}>Zentralübung</th>
                    </tr>
                </thead>
                <tbody>
                    {dateObjects.map((date) => {
                        const startDate = date;
                        // Adds 6 days to startday
                        const endDate = new Date(
                            startDate.getTime() + 6 * 24 * 60 * 60 * 1000
                        );
                        const formattedStartDate = formatDate(startDate);
                        const formattedEndDate = formatDate(endDate);

                        return (
                            <tr key={date.getTime()}>
                                <td className="WeekCol">
                                    <p>{formattedStartDate} -</p>
                                    <p>{formattedEndDate}</p>
                                </td>

                                {["GU", "ZU"].map((group) => {
                                    // formats the string so that it matches
                                    // the format in the database
                                    const weekLookup23 =
                                        formattedStartDate + "/" + 23;
                                    const weekLookup24 =
                                        formattedStartDate + "/" + 24;

                                    // checks if user has an entry for Gu/Zu
                                    const currentItem = props.subjectData[
                                        group as keyof SubjectData
                                    ].find(
                                        (item) =>
                                            item.Week === weekLookup23 ||
                                            item.Week === weekLookup24
                                    );

                                    if (
                                        currentItem?.Id.includes("N/A") ||
                                        !currentItem
                                    )
                                        return (
                                            <td
                                                className="WorksheetColContainer Na"
                                                key={group}
                                            >
                                                {"N/A"}
                                            </td>
                                        );

                                    const userHasEntry = props.userData.find(
                                        (u) => u.Id === currentItem?.Id
                                    );

                                    return (
                                        <td
                                            className={`${
                                                userHasEntry
                                                    ? userHasEntry.Status
                                                    : "not_done"
                                            } WorksheetColContainer`}
                                            key={group}
                                        >
                                            <div className="WorksheetColWrapper">
                                                {currentItem?.Id}
                                                {/* <p>{userHasEntry?.Notes}</p> */}
                                                <button
                                                    onClick={() => {
                                                        handleStatusChange(
                                                            currentItem?.Id
                                                        );
                                                    }}
                                                >
                                                    Change Status
                                                </button>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

export default Weektable;
