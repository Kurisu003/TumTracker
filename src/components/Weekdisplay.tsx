import { getAuth } from "firebase/auth";
import Bars from "./Bars";
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

    // Todo: Create tables
    // Todo: Sort by weeks
    // Todo: Implement different statuses
    // Todo: Implement id-ing for users for what they've done

    const json = {
        GU: [
            {
                Id: "AnGu3",
                Week: "20/11/23",
            },
            {
                Id: "AnGu2",
                Week: "13/11/23",
            },
            {
                Id: "AnGu1",
                Week: "06/11/23",
            },
        ],
        ZU: [
            {
                Id: "AnZu4",
                Week: "20/11/23",
            },
            {
                Id: "AnZu3",
                Week: "13/11/23",
            },
            {
                Id: "AnZu2",
                Week: "06/11/23",
            },
        ],
    };

    const user = [
        {
            Id: "AnGu1",
            status: "not_done",
        },
        {
            Id: "AnGu2",
            status: "went_ok",
        },
    ];

    // useEffect(() => {
    //     async function init() {
    //         let a = await getWorksheets(props.subject);
    //     }
    //     init();
    // }, []);

    const Table = (props: { data: any }) => {
        const weeks = [
            ...new Set(
                props.data.GU.map((item: any) => item.Week).concat(
                    props.data.ZU.map((item: any) => item.Week)
                )
            ),
        ];

        return (
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {["GU", "ZU"].map((group) => (
                            <th key={group}>{group}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week) => (
                        <tr key={week as string}>
                            <td>{week as string}</td>
                            {["GU", "ZU"].map((group) => {
                                const item = props.data[group].find(
                                    (item: any) => item.Week === week
                                );
                                return (
                                    <td key={group}>{item ? item.Id : ""}</td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            <Bars />
            <div className="WeekdisplayContainer">
                <h1>{propsToTitle[props.subject]}</h1>

                <Table data={json} />
            </div>
        </>
    );
}

export default Weekdisplay;
