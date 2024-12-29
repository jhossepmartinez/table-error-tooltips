export type DataSource = Record<string, string | Record<string, string []>>

export type EnrichedDataSource = DataSource & {
    errors?: Record<string, string[]>;
};

export type Validator = (data: EnrichedDataSource[]) => EnrichedDataSource[];


