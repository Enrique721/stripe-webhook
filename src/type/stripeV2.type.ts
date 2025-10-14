
export type idTypeV2 = string;
export type objectTypeV2 = "v2.core.event"; // "v2.core.event"
export type contextTypeV2 = null | string;
export type createdTypeV2 = string; // ISO time string
export type dataTypeV2 = null | object;
export type livemodeTypeV2 = boolean;
export type reasonV2 = null | { request: null | reasonRequestV2, type: number }; // type enum

export type reasonRequestV2 = {
    id: string,
    idempotency_key: string
};

export type related_objectV2  = {
    id: string,
    type: string,
    url: string
}

export type typeV2 = string;