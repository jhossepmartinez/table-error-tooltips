export type DataSource = Record<string, string | null | Record<string, string []>>

export type EnrichedDataSource = DataSource & {
    errors?: Record<string, string[]>;
};


export type ColumnProperty = {
    name: string;
    isRequired: boolean;
}

export type IndexErrors = Record<string, Record<string, string[]>>

export type Validator = (data: EnrichedDataSource[], indexErrors: IndexErrors) => EnrichedDataSource[];
