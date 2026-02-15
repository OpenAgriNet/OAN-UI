import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Shield, MapPin, Camera, Database, Users, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

function PrivacyPolicy() {
	const navigate = useNavigate();

	return (
		<div className="flex h-full flex-col bg-background transition-colors duration-300">
			{/* Privacy Policy Header */}
			<div className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/chat" })}
					className="h-10 w-10 text-gray-900 dark:text-gray-100"
				>
					<ArrowLeft className="h-6 w-6" />
				</Button>
				<h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Privacy Policy</h1>
			</div>

			{/* Privacy Policy Content */}
			<div className="flex-1 overflow-y-auto p-5">
				<div className="mx-auto max-w-4xl space-y-6">
					{/* Introduction */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Shield className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<div>
								<h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
									Privacy Policy
								</h2>
								<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
									The Event Participants Count System (EPCS) Mobile Application is committed to
									protecting your privacy and ensuring the security of your personal information.
								</p>
							</div>
						</div>
					</div>

					{/* 1. Information We Collect */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Database className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								1. Information We Collect
							</h2>
						</div>

						<div className="ml-9 space-y-4">
							{/* 1.1 Personal Information */}
							<div>
								<h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
									1.1 Personal Information
								</h3>
								<ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Name</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Mobile number</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Designation and organization (for Event Managers/Admins)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Authentication details (OTP)</span>
									</li>
								</ul>
							</div>

							{/* 1.2 Event and Participation Data */}
							<div>
								<h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
									1.2 Event and Participation Data
								</h3>
								<ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Event details (title, date, venue, department, SPOC details)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Participant counts (Male/Female/Total, category-wise)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Attendance counts and records (Manual)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Citizen participation details (where applicable)</span>
									</li>
								</ul>
							</div>

							{/* 1.3 Location and Media Data */}
							<div>
								<h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
									1.3 Location and Media Data
								</h3>
								<ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>GPS location data while creating or attending events</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Event photographs and short videos (with geo-tagging)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Device information for security purposes</span>
									</li>
								</ul>
							</div>

							{/* 1.4 Automatically Collected Information */}
							<div>
								<h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
									1.4 Automatically Collected Information
								</h3>
								<ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>App usage logs</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Device type, Android version</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-[#00a651]">•</span>
										<span>Network status for synchronization</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* 2. Purpose of Data Collection */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<FileText className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								2. Purpose of Data Collection
							</h2>
						</div>
						<p className="mb-3 ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							The information collected is used solely for:
						</p>
						<ul className="ml-9 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Managing and monitoring government events</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Participant counts and attendance</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Generating analytics, dashboards, and reports</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Sending notifications, alerts, and reminders</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Ensuring transparency, accountability, and impact assessment</span>
							</li>
						</ul>
					</div>

					{/* 3. Data Sharing and Disclosure */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Users className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								3. Data Sharing and Disclosure
							</h2>
						</div>
						<ul className="ml-9 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Data is not shared with any third-party commercial entities.</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									Information may be shared internally with authorized Government Departments and
									Ministries strictly for official purposes.
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Data may be disclosed if required by law or government directives.</span>
							</li>
						</ul>
					</div>

					{/* 4. Data Storage and Security */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Lock className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								4. Data Storage and Security
							</h2>
						</div>
						<ul className="ml-9 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									All data is securely stored on the Ministry-approved cloud infrastructure.
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									Appropriate technical and organizational security measures are implemented to
									prevent unauthorized access, alteration, or disclosure.
								</span>
							</li>
						</ul>
					</div>

					{/* 5. Permissions Used */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Camera className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								5. Permissions Used
							</h2>
						</div>
						<p className="mb-3 ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							The mobile app may request the following permissions:
						</p>
						<ul className="ml-9 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									<strong className="text-gray-900 dark:text-gray-100">Camera:</strong> To capture
									event photos/videos for attendance validation
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									<strong className="text-gray-900 dark:text-gray-100">Location:</strong> To geo-tag
									event venues and media
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									<strong className="text-gray-900 dark:text-gray-100">Storage:</strong> To save
									data and media
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>
									<strong className="text-gray-900 dark:text-gray-100">Internet:</strong> For data
									sync and notifications
								</span>
							</li>
						</ul>
						<p className="mt-3 ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							Permissions are used strictly for app functionality.
						</p>
					</div>

					{/* 6. User Rights */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Shield className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								6. User Rights
							</h2>
						</div>
						<p className="mb-3 ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							Users have the right to:
						</p>
						<ul className="ml-9 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Access their submitted information</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 text-[#00a651]">•</span>
								<span>Request correction of inaccurate data through authorized administrators</span>
							</li>
						</ul>
					</div>

					{/* 7. Children's Privacy */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<Users className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								7. Children's Privacy
							</h2>
						</div>
						<p className="ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							The EPCS Mobile Application is not intended for use by children under 18 years of age.
							No knowingly collected children's data is stored.
						</p>
					</div>

					{/* 8. Changes to This Privacy Policy */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<FileText className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								8. Changes to This Privacy Policy
							</h2>
						</div>
						<p className="ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							This Privacy Policy may be updated from time to time. Any changes will be reflected
							within the app and/or official platforms.
						</p>
					</div>

					{/* 9. Contact Information */}
					<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-4 flex items-start gap-3">
							<MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-[#00a651]" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								9. Contact Information
							</h2>
						</div>
						<p className="mb-3 ml-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							For questions or concerns regarding this Privacy Policy, please contact:
						</p>
						<div className="ml-9 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
							<p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
								Department of Agriculture and Farmers Welfare
							</p>
							<p className="text-sm text-gray-700 dark:text-gray-300">
								Ministry of Agriculture and Farmers Welfare
							</p>
							<p className="text-sm text-gray-700 dark:text-gray-300">Government of India</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PrivacyPolicy;
