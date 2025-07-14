'use client';

import {useEffect, useRef, useState} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, [companionId]);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        // @ts-expect-error - vapi.start types are incompatible with our configuration
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <section className="voice-container min-h-[70vh] relative">
            {/* Neural Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-neural-purple/10 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute bottom-20 right-16 w-16 h-16 bg-neural-blue/8 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-10 w-12 h-12 bg-neural-green/6 rounded-full blur-md animate-ping" style={{animationDelay: '2s'}}></div>
            </div>

            <section className="flex gap-8 max-sm:flex-col h-full">
                {/* AI Companion Section */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 relative max-sm:order-2">
                    {/* Neural Avatar Container */}
                    <div className="relative w-80 h-80 max-sm:w-32 max-sm:h-32">
                        {/* Outer Neural Ring */}
                        <div className={cn(
                            "absolute inset-0 rounded-full transition-all duration-1000",
                            callStatus === CallStatus.ACTIVE && "animate-ping"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/30 via-neural-blue/30 to-neural-green/30 rounded-full blur-sm"></div>
                        </div>

                        {/* Middle Glass Ring */}
                        <div className="absolute inset-4 glass-panel rounded-full border-2 border-neural-purple/20">
                            <div className="absolute inset-0 neural-pattern opacity-20 rounded-full"></div>
                        </div>

                        {/* Inner Avatar */}
                        <div className="absolute inset-8 neomorph-raised rounded-full flex items-center justify-center" 
                             style={{ backgroundColor: getSubjectColor(subject) + '20'}}>
                            
                            {/* Static Icon State */}
                            <div className={cn(
                                'absolute transition-opacity duration-1000 flex items-center justify-center',
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'animate-pulse'
                            )}>
                                <div className="glass-panel rounded-full p-6">
                                    <Image 
                                        src={`/icons/${subject}.svg`} 
                                        alt={subject} 
                                        width={80} 
                                        height={80} 
                                        className="max-sm:w-8 max-sm:h-8" 
                                    />
                                </div>
                            </div>

                            {/* Active Lottie Animation */}
                            <div className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0'
                            )}>
                                <div className="relative">
                                    <Lottie
                                        lottieRef={lottieRef}
                                        animationData={soundwaves}
                                        autoplay={false}
                                        className="w-80 h-80 max-sm:w-32 max-sm:h-32"
                                    />
                                    {/* Neural Pulse Overlay */}
                                    {isSpeaking && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/20 via-neural-blue/20 to-neural-green/20 rounded-full animate-ping"></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Neural Connection Dots */}
                        {callStatus === CallStatus.ACTIVE && (
                            <>
                                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-neural-purple rounded-full animate-pulse"></div>
                                <div className="absolute top-1/2 -right-2 w-3 h-3 bg-neural-blue rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                                <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-neural-green rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                                <div className="absolute top-1/2 -left-2 w-3 h-3 bg-neural-orange rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                            </>
                        )}
                    </div>

                    {/* AI Name */}
                    <div className="text-center">
                        <h2 className="font-bold text-2xl gradient-neural text-shadow-neural">{name}</h2>
                        <div className={cn(
                            "mt-2 px-4 py-1 glass-panel rounded-full text-sm transition-colors duration-300",
                            callStatus === CallStatus.ACTIVE && "border-neural-green/50 text-neural-green",
                            callStatus === CallStatus.CONNECTING && "border-neural-orange/50 text-neural-orange animate-pulse",
                            callStatus === CallStatus.INACTIVE && "border-neural-500/50 text-neural-500"
                        )}>
                            {callStatus === CallStatus.ACTIVE && "Speaking..."}
                            {callStatus === CallStatus.CONNECTING && "Connecting..."}
                            {callStatus === CallStatus.INACTIVE && "Ready to teach"}
                            {callStatus === CallStatus.FINISHED && "Session complete"}
                        </div>
                    </div>
                </div>

                {/* User Controls Section */}
                <div className="w-80 max-sm:w-full flex flex-col gap-6 max-sm:order-1">
                    {/* User Avatar Card - Moved to top */}
                    <div className="glass-panel rounded-2xl p-6 text-center space-y-4 order-first">
                        <div className="mx-auto w-24 h-24 glass-panel rounded-full p-1">
                            <Image 
                                src={userImage} 
                                alt={userName} 
                                width={88} 
                                height={88} 
                                className="rounded-full" 
                            />
                        </div>
                        <h3 className="font-bold text-xl text-neural-900">{userName}</h3>
                    </div>

                    {/* Speaker Animation - Above microphone */}
                    <div className="glass-panel rounded-2xl p-4 text-center">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <div className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    callStatus === CallStatus.ACTIVE ? "bg-neural-green animate-pulse" : "bg-neural-500"
                                )}></div>
                                <div className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    callStatus === CallStatus.ACTIVE ? "bg-neural-green animate-pulse" : "bg-neural-500"
                                )}></div>
                                <div className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    callStatus === CallStatus.ACTIVE ? "bg-neural-green animate-pulse" : "bg-neural-500"
                                )}></div>
                            </div>
                            <p className="text-sm text-neural-600">
                                {callStatus === CallStatus.ACTIVE ? "Speaking..." : "Ready to speak"}
                            </p>
                        </div>
                    </div>

                    {/* Microphone Control */}
                    <button 
                        className={cn(
                            "glass-panel rounded-2xl p-6 max-sm:p-4 flex flex-col items-center gap-4 max-sm:gap-2 transition-all duration-300",
                            "hover:scale-105 group relative overflow-hidden",
                            callStatus !== CallStatus.ACTIVE && "opacity-50 cursor-not-allowed",
                            isMuted ? "border-destructive/30" : "border-neural-green/30"
                        )}
                        onClick={toggleMicrophone} 
                        disabled={callStatus !== CallStatus.ACTIVE}
                    >
                        <div className={cn(
                            "w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                            isMuted ? "bg-destructive/20" : "bg-neural-green/20"
                        )}>
                            <Image 
                                src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} 
                                alt="microphone" 
                                width={32} 
                                height={32} 
                                className="max-sm:w-6 max-sm:h-6"
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-sm max-sm:text-xs">
                                {isMuted ? 'Microphone Off' : 'Microphone On'}
                            </p>
                            <p className="text-xs text-neural-500 max-sm:hidden">
                                Click to {isMuted ? 'unmute' : 'mute'}
                            </p>
                        </div>
                    </button>

                    {/* Session Control Button */}
                    <button 
                        className={cn(
                            'btn-neural w-full text-center py-4 font-bold text-lg relative overflow-hidden group',
                            callStatus === CallStatus.ACTIVE && 'bg-gradient-to-r from-red-500 via-red-600 to-red-700',
                            callStatus === CallStatus.CONNECTING && 'animate-pulse opacity-80'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {callStatus === CallStatus.ACTIVE && (
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            )}
                            {callStatus === CallStatus.ACTIVE && "End Session"}
                            {callStatus === CallStatus.CONNECTING && "Connecting..."}
                            {(callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) && "Start New Session"}
                        </span>
                    </button>
                </div>
            </section>

            {/* Enhanced Transcript Section */}
            <section className="mt-8 h-64 relative">
                <div className="glass-panel rounded-2xl h-full p-6 overflow-hidden">
                    <h3 className="font-bold text-lg gradient-neural mb-4">Live Transcript</h3>
                    <div className="h-40 overflow-y-auto no-scrollbar space-y-3">
                        {messages.map((message, index) => {
                            const isAssistant = message.role === 'assistant';
                            return (
                                <div key={index} className={cn(
                                    "p-3 rounded-xl transition-all duration-300",
                                    isAssistant 
                                        ? "glass-panel border-l-4 border-neural-purple" 
                                        : "bg-neural-blue/10 border-l-4 border-neural-blue"
                                )}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            isAssistant ? "bg-neural-purple" : "bg-neural-blue"
                                        )}></div>
                                        <span className="text-xs font-semibold text-neural-600">
                                            {isAssistant ? name.split(' ')[0] : userName}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-neural-700">
                                        {message.content}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Gradient fade at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-glass-50 to-transparent pointer-events-none"></div>
                </div>
            </section>
        </section>
    )
}

export default CompanionComponent
