import rootConfigData from "../../../../../config.json";

const rootConfig = rootConfigData as any;

// Single call+chat glyph shown next to the contact line in the welcome intro.
// Symbol and color are driven by `contactIcon` in config.json:
//   { "symbol": "material-filled" | "material-outlined" | "whatsapp" | "none",
//     "color": "#F65151" }
export type ContactIconSymbol = "material-filled" | "material-outlined" | "whatsapp" | "none";

export const CONTACT_ICON: { symbol: ContactIconSymbol; color: string } = {
	symbol: rootConfig.contactIcon?.symbol ?? "material-filled",
	color: rootConfig.contactIcon?.color ?? "#F65151"
};

type ContactIconProps = {
	symbol?: ContactIconSymbol;
	color?: string;
	className?: string;
};

export function ContactIcon({
	symbol = CONTACT_ICON.symbol,
	color = CONTACT_ICON.color,
	className
}: ContactIconProps) {
	if (symbol === "none") return null;

	if (symbol === "whatsapp") {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
				aria-hidden="true"
			>
				<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
				<g transform="translate(7.1,6.9) scale(0.42)">
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
						fill={color}
						stroke="none"
					/>
				</g>
			</svg>
		);
	}

	// Material Symbols "perm_phone_msg" (Apache 2.0)
	const d =
		symbol === "material-outlined"
			? "M480-440v-360q0-17 11.5-28.5T520-840h280q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560H600L480-440Zm80-193 17-17h183v-110H560v127ZM798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67Z"
			: "M480-440v-360q0-17 11.5-28.5T520-840h280q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560H600L480-440Zm318 320q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z";

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 -960 960 960"
			fill={color}
			className={className}
			aria-hidden="true"
		>
			<path d={d} />
		</svg>
	);
}
