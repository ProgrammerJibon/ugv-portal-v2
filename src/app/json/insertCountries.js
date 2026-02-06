"use server";

export default async (connect) => {{
    const sql = `INSERT IGNORE INTO country_list (id, name, short_code, flag_url, phone_min_length, phone_max_length) VALUES
    (1, 'United States', 'US', 'https://flagcdn.com/us.svg', '10', '10'),
    (2, 'Canada', 'CA', 'https://flagcdn.com/ca.svg', '10', '10'),
    (3, 'United Kingdom', 'GB', 'https://flagcdn.com/gb.svg', '10', '10'),
    (4, 'Australia', 'AU', 'https://flagcdn.com/au.svg', '9', '9'),
    (5, 'Germany', 'DE', 'https://flagcdn.com/de.svg', '11', '11'),
    (6, 'France', 'FR', 'https://flagcdn.com/fr.svg', '9', '9'),
    (7, 'Portugal', 'PT', 'https://flagcdn.com/pt.svg', '9', '9'),
    (8, 'Brazil', 'BR', 'https://flagcdn.com/br.svg', '10', '11'),
    (9, 'South Africa', 'ZA', 'https://flagcdn.com/za.svg', '9', '9'),
    (10, 'Bangladesh', 'BD', 'https://flagcdn.com/bd.svg', '11', '11'),
    (11, 'Japan', 'JP', 'https://flagcdn.com/jp.svg', '10', '10')
    ;`;
    const [query] = await connect.execute(sql);
    return query ? true : false;
}}