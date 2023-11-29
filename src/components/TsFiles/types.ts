export type UserData =
    {
        Id: string;
        Status: Status;
        Notes?: string;
    }[]
;

export type Status = "great"
            | "good"
            | "ok"
            | "bad"
            | "horrible"
            | "not_done"
            | "not_availible"

export type SubjectData = {
    "GU":
        {
            Id: string;
            Week: string;
        }[]
    ;
    "ZU":
        {
            Id: string;
            Week: string;
        }[]
    ;
};

export type subjectShorts =
    | "An"
    | "La"
    | "St"
    | "Ct"
    | "Dt";

export type subjectToTitle = {
    [k in subjectShorts]:string
};
