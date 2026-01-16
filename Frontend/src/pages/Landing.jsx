
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Zap, Trophy, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-brand-50 pt-20 pb-32 lg:pt-32 lg:pb-40">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/30 blur-3xl animate-pulse" />
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Master any subject with <span className="text-brand-600">Quiz App</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            The smartest way to learn. Create custom quizzes, challenge friends, and track your progress in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/auth">
                                <Button className="text-lg px-8 py-4 rounded-full shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transform hover:-translate-y-1 transition-all">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link to="#features">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why choose Quiz App?</h2>
                        <p className="text-lg text-slate-600">Everything you need to supercharge your learning experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-brand-600" />}
                            title="Smart Learning"
                            description="Our AI-powered system adapts to your learning pace and focuses on areas that need improvement."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-yellow-500" />}
                            title="Real-time Battles"
                            description="Challenge your friends or random opponents to live quiz battles and climb the leaderboard."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-orange-500" />}
                            title="Track Progress"
                            description="Detailed analytics and insights help you visualize your growth and celebrate your milestones."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatItem value="10K+" label="Active Users" />
                        <StatItem value="500K+" label="Quizzes Taken" />
                        <StatItem value="50+" label="Subjects" />
                        <StatItem value="4.9/5" label="User Rating" />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl hover:shadow-brand-100 transition-all duration-300 border border-slate-100 hover:border-brand-200 group"
    >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const StatItem = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400 mb-2">
            {value}
        </span>
        <span className="text-slate-400 font-medium">{label}</span>
    </div>
);

export default Landing;
