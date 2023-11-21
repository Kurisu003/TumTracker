import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import Bars from "./Bars";
import { getWorksheets } from "./TsFiles/databaseinteraction";
import { subjectShorts } from "./TsFiles/types";
import "./css/Weekdisplay.css";

function Weekdisplay(props: { subject: subjectShorts }) {
    const auth = getAuth();
    const propsToTitle = {
        analysis: "Analysis",
        linalg: "Lineare Algebra",
        schaltung: "Schaltungstheorie",
        comptech: "Computertechnik",
        digtech: "Digitaltechnik",
    };
    let guData: any = null;
    let zuData: any = null;
    let weeks: any = null;

    // Todo: Create tables
    // Todo: Sort by weeks
    // Todo: Implement different statuses
    // Todo: Implement id-ing for users for what they've done

    useEffect(() => {
        async function init() {
            let a = await getWorksheets(props.subject);
        }
        init();
    }, []);

    return (
        <>
            <Bars />
            <div className="WeekdisplayContainer">
                <h1>{propsToTitle[props.subject]}</h1>
            </div>
        </>
    );
}

export default Weekdisplay;
