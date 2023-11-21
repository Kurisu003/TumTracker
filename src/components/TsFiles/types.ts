export type userReport = {
    Username: string;
    Subject:{
        Analysis:{
            Zu: [Subject],
            Gu: [Subject]
        }
        LinAlg:{
            Zu: [Subject],
            Gu: [Subject]
        }
        Schaltung:{
            Zu: [Subject],
            Gu: [Subject]
        }
        CompSci:{
            Zu: [Subject],
            Gu: [Subject]
        }
        Digital:{
            Zu: [Subject],
            Gu: [Subject]
        }
    }
}

export type Subject = {
    Week: string,
    AbNr: number,
    Rating: "great" | "good" | "ok" | "bad" | "horrible" | "not_done" | "not_availible"
}

export type subjectShorts = "analysis" | "linalg" | "schaltung" | "comptech" | "digtech"