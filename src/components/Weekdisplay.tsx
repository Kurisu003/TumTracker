import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Bars from "./Bars";
import { getUserData, getWorksheets } from "./TsFiles/databaseinteraction";
import {
    SubjectData,
    UserData,
    subjectShorts,
    subjectToTitle,
} from "./TsFiles/types";
import Weektable from "./Weektable";
import "./css/Weekdisplay.css";

function Weekdisplay(props: { subject: subjectShorts }) {
    const auth = getAuth();
    const propsToTitle: subjectToTitle = {
        An: "Analysis",
        La: "Lineare Algebra",
        St: "Schaltungstheorie",
        Ct: "Computertechnik",
        Dt: "Digitaltechnik",
    };
    const [subjectJson, setConstSubjectJson] = useState<SubjectData | null>(
        null
    );
    const [userData, setUserData] = useState<UserData | null | any>(null);
    const [forceUpdate, setForceUpdate] = useState<boolean>(false);
    // Todo: Blur bg on sidebar open
    useEffect(() => {
        async function init() {
            setForceUpdate(false);
            const a = await getWorksheets(props.subject);
            setConstSubjectJson(a);
            const b = await getUserData(auth.currentUser?.displayName || "");
            setUserData(b);
        }
        init();
    }, [forceUpdate]);

    return (
        <>
            <Bars />
            <div className="WeekdisplayContainer">
                <h1>{propsToTitle[props.subject]}</h1>
                {subjectJson?.GU && userData ? (
                    <Weektable forceUpdate={setForceUpdate} subjectData={subjectJson} userData={userData} />
                ) : (
                    <div>
                        <p>Loading ...</p>
                        <p>Are you signed in?</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Weekdisplay;
