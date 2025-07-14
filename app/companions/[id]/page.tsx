import {getCompanion} from "@/lib/actions/companion.actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getSubjectColor} from "@/lib/utils";
import {teachingStyles} from "@/constants";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    const { name, subject, title, topic, teachingStyle, duration } = companion;
    
    // Backward compatibility: map duration to teachingStyle for existing companions
    const finalTeachingStyle = teachingStyle || (
        duration <= 10 ? 'quick' : 
        duration <= 20 ? 'balanced' : 
        'deep'
    );

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions')

    return (
        <main>
            <article className="flex rounded-border justify-between p-6 max-md:flex-col">
                <div className="flex items-center gap-2">
                    <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-2xl">
                                {name}
                            </p>
                            <div className="subject-badge max-sm:hidden">
                                {subject}
                            </div>
                        </div>
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                <div className="items-start max-md:hidden">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{teachingStyles[finalTeachingStyle as keyof typeof teachingStyles]?.icon}</span>
                        <span className="text-lg font-semibold">{teachingStyles[finalTeachingStyle as keyof typeof teachingStyles]?.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {teachingStyles[finalTeachingStyle as keyof typeof teachingStyles]?.description}
                    </p>
                </div>
            </article>

            <CompanionComponent
                companionId={id}
                subject={subject}
                topic={topic}
                name={name}
                userName={user.firstName!}
                userImage={user.imageUrl!}
                voice={companion.voice}
                style={companion.style}
                teachingStyle={finalTeachingStyle}
            />
        </main>
    )
}

export default CompanionSession
