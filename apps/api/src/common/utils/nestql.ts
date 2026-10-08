// {
//  user: { //prefix
//   [keys]: //prefix keys
//  }
// }


export type Case = "camel" | "snake" | "pascal" | "keep";

export type Option =
    | {
        prefix: string;
        casing?: Case;
        pick?: string[];
        omit?: undefined;
        throwOnError?: boolean;
    }
    | {
        prefix: string;
        casing?: Case;
        pick?: undefined;
        omit?: string[];
        throwOnError?: boolean;
    };

export type FlatRecord = Record<string, unknown>;


export const capitalize = (str: string) => {
    return str.replace(/^./, (c) => c.toUpperCase());
};

export const toSnakeCase = (str: string): string => {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
        .toLowerCase();
};

export const toCamelCase = (str: string): string => {
    return str
        .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
};

export const toPascalCase = (str: string): string => {
    return str.replace(/(^|_)(.)/g, (_, __, c) => c.toUpperCase());
};

export const toCasedKey = (
    uncasedPrefixKey: string,
    casing: Case = "camel"
) => {
    if (casing === "keep") {
        return uncasedPrefixKey;
    }

    if (casing === "snake") {
        return toSnakeCase(uncasedPrefixKey);
    }

    if (casing === "camel") {
        return toCamelCase(uncasedPrefixKey);
    }

    return toPascalCase(uncasedPrefixKey);
};


export const isPureObject = (value: unknown) => {
    return Object.prototype.toString.call(value) === "[object Object]";
};


export const nestql = <T extends Record<string, unknown>>(
    flat: FlatRecord,
    option: Option
) => {
    let object = {} as T;
    const { casing = "camel", pick, omit, throwOnError = false } = option;
    const prefix = option.prefix.trim();

    try {
        for (const [key, value] of Object.entries(flat)) {
            if (!key.startsWith(prefix) || key[prefix.length] !== "_") {
                continue;
            }

            const uncasedPrefixKey = key.replace(`${prefix}_`, "");
            const prefixKey = toCasedKey(uncasedPrefixKey, casing);

            if (omit && omit.includes(uncasedPrefixKey)) {
                //if ommited, skip
                continue;
            }
            if (!omit && pick && !pick.includes(uncasedPrefixKey)) {
                // omit overrides whitelist
                continue;
            }

            (object[prefixKey] as any) = value;
        }
        return object as T;
    } catch (e: any) {
        const message = !isPureObject(flat)
            ? "nestql: flat object must be a pure object"
            : e?.message ?? "nestql: nestql error";

        if (throwOnError) {
            throw new Error(message);
        } else {
            console.error(message);
        }
        return {} as T;
    }
};

