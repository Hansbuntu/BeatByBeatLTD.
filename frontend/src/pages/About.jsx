import { Link } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card.jsx'

export default function About() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Hero Section */}
			<section className="border-4 border-black dark:border-white rounded-xl p-8 md:p-12 shadow-[6px_6px_0_0_rgba(0,0,0,1)] bg-white dark:bg-black">
				<h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-black dark:text-white uppercase tracking-wide">
					About <span className="uppercase tracking-wide">BeatByBeatRecordLtd</span>
				</h1>
				<p className="text-xl md:text-2xl font-bold text-black dark:text-white opacity-90">
					A space for emerging artists to showcase, sell, and share their music with the world.
				</p>
			</section>

			{/* Mission */}
			<Card>
				<CardContent className="pt-6">
					<h2 className="text-2xl font-extrabold mb-4 text-black dark:text-white uppercase tracking-wide">
						Our Mission
					</h2>
					<p className="text-black dark:text-white opacity-90 leading-relaxed mb-4">
						<span className="font-extrabold uppercase tracking-wide">BeatByBeatRecordLtd</span> is dedicated to amplifying the voices of emerging artists. We believe every creator deserves a platform to share their art, build their audience, and earn from their craft.
					</p>
					<p className="text-black dark:text-white opacity-90 leading-relaxed">
						Born in Ghana with a global vision, we're building a community where music discovery, exclusive releases, and artist empowerment come together.
					</p>
				</CardContent>
			</Card>

			{/* What We Do */}
			<section className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardContent className="pt-6">
						<h3 className="text-xl font-extrabold mb-3 text-black dark:text-white uppercase tracking-wide">
							🎵 Music Blog
						</h3>
						<p className="text-black dark:text-white opacity-90 leading-relaxed">
							Discover new sounds, read in-depth features, and stay connected with the latest releases and artist stories.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h3 className="text-xl font-extrabold mb-3 text-black dark:text-white uppercase tracking-wide">
							💎 Exclusive Store
						</h3>
						<p className="text-black dark:text-white opacity-90 leading-relaxed">
							Every track in our store is unique and exclusive. When you purchase, you're directly supporting the artist—we split revenue fairly.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h3 className="text-xl font-extrabold mb-3 text-black dark:text-white uppercase tracking-wide">
							🚀 Artist Platform
						</h3>
						<p className="text-black dark:text-white opacity-90 leading-relaxed">
							Submit your music for review. If selected, your work gets featured on our blog and can be sold as an exclusive release.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h3 className="text-xl font-extrabold mb-3 text-black dark:text-white uppercase tracking-wide">
							🌍 Global Reach
						</h3>
						<p className="text-black dark:text-white opacity-90 leading-relaxed">
							Ghana-first, but worldwide. We accept payments via Paystack (Mobile Money & Cards) and support artists everywhere.
						</p>
					</CardContent>
				</Card>
			</section>

			{/* How It Works */}
			<Card>
				<CardContent className="pt-6">
					<h2 className="text-2xl font-extrabold mb-6 text-black dark:text-white uppercase tracking-wide">
						How It Works
					</h2>
					<div className="space-y-6">
						<div className="flex gap-4">
							<div className="flex-shrink-0 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg">
								1
							</div>
							<div>
								<h4 className="font-extrabold text-lg mb-2 text-black dark:text-white">Submit Your Music</h4>
								<p className="text-black dark:text-white opacity-90 leading-relaxed">
									Sign in as an artist and submit your tracks, links, and notes. Our team reviews every submission with care.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="flex-shrink-0 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg">
								2
							</div>
							<div>
								<h4 className="font-extrabold text-lg mb-2 text-black dark:text-white">Review Process</h4>
								<p className="text-black dark:text-white opacity-90 leading-relaxed">
									We review submissions within 3-5 business days. If accepted, we'll feature your work and discuss exclusive release options.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="flex-shrink-0 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg">
								3
							</div>
							<div>
								<h4 className="font-extrabold text-lg mb-2 text-black dark:text-white">Get Featured & Paid</h4>
								<p className="text-black dark:text-white opacity-90 leading-relaxed">
									Your music gets featured on our blog, and if sold as an exclusive, you receive your share of every purchase.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Call to Action */}
			<div className="border-4 border-black dark:border-white rounded-xl p-8 bg-black dark:bg-white text-white dark:text-black text-center">
				<h2 className="text-3xl font-extrabold mb-4 uppercase tracking-wide">
					Ready to Share Your Sound?
				</h2>
				<p className="text-lg mb-6 opacity-90">
					Join the community of emerging artists making their mark.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link 
						to="/submit" 
						className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-lg border-2 border-white dark:border-black font-extrabold hover:opacity-90 transition uppercase"
					>
						Submit Your Music
					</Link>
					<Link 
						to="/store" 
						className="px-6 py-3 bg-transparent border-2 border-white dark:border-black text-white dark:text-black rounded-lg font-extrabold hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition uppercase"
					>
						Browse Exclusives
					</Link>
				</div>
			</div>

			{/* Contact/Info */}
			<Card>
				<CardContent className="pt-6">
					<h2 className="text-2xl font-extrabold mb-4 text-black dark:text-white uppercase tracking-wide">
						Connect With Us
					</h2>
					<p className="text-black dark:text-white opacity-90 leading-relaxed mb-4">
						Have questions? Want to collaborate? Reach out through our submission form or follow us for updates on new releases and featured artists.
					</p>
					<p className="text-black dark:text-white opacity-70 text-sm">
						Based in Ghana • Supporting artists worldwide
					</p>
				</CardContent>
			</Card>
		</div>
	)
}

