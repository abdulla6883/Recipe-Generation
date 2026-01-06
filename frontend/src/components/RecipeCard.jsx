import React from 'react';
import { ChefHat, Utensils, List } from 'lucide-react';

const RecipeCard = ({ data }) => {
    if (!data || !data.recipe) return null;

    const { title, ingredients, instructions } = data.recipe;

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-100 animate-fade-in relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-chef-primary via-chef-accent to-chef-primary"></div>

            <div className="bg-chef-primary p-6 md:p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ChefHat className="w-24 h-24 md:w-32 md:h-32" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-serif mb-2 relative z-10">
                    {title || "Generated Recipe"}
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-2 text-chef-muted font-light relative z-10">
                    <span className="uppercase tracking-widest text-xs">Identified as</span>
                    <span className="text-chef-accent font-medium text-lg">{data.detected_food}</span>
                </div>
            </div>

            <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white">
                <div>
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-chef-primary border-b border-gray-100 pb-4">
                        <Utensils className="w-6 h-6 text-chef-accent" />
                        Ingredients
                    </h3>
                    {ingredients.length > 0 ? (
                        <ul className="space-y-4">
                            {ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-chef-secondary group hover:bg-chef-light p-2 rounded transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-chef-accent mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                    <span className="font-light text-lg leading-relaxed border-b border-transparent group-hover:border-gray-200">{ing}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic font-light">No ingredients parsed.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-chef-primary border-b border-gray-100 pb-4">
                        <List className="w-6 h-6 text-chef-accent" />
                        Instructions
                    </h3>
                    {instructions.length > 0 ? (
                        <ol className="space-y-6">
                            {instructions.map((step, idx) => (
                                <li key={idx} className="flex gap-4 text-chef-secondary group">
                                    <span className="font-serif font-bold text-chef-accent/40 text-2xl -mt-1 select-none group-hover:text-chef-accent transition-colors">
                                        {String(idx + 1).padStart(2, '0')}.
                                    </span>
                                    <span className="font-light text-lg leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-gray-400 italic font-light">No instructions parsed.</p>
                    )}
                </div>
            </div>

            {/* Fallback for raw text if parsing failed largely */}
            {(ingredients.length === 0 || instructions.length === 0) && data.recipe.raw_text && (
                <div className="p-8 border-t border-gray-100 bg-chef-light">
                    <h3 className="text-lg font-bold mb-2 text-chef-primary font-serif">Deep Chef Thought Process:</h3>
                    <p className="text-chef-secondary whitespace-pre-wrap font-mono text-sm leading-relaxed p-4 bg-white border border-gray-200 rounded">
                        {data.recipe.raw_text}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;
