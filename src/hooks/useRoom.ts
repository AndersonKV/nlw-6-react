import { FormEvent, useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './auth';

type FirebaseQuestions = Record<
    string,
    {
        id: string;
        content: string;
        author: {
            name: string;
            avatar: string;
        };
        isHighLighted: boolean;
        isAnswered: boolean;
        likes: Record<string, {
            authorId: string;
        }>
    }
>;


type QuestionProps = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    isHighLighted: boolean;
    isAnswered: boolean;
    hasLiked: boolean;
    likeCount: number;
    likeId: string | undefined;

};

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionProps[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);


        roomRef.on('value', room => {
            const databaseRoom = room.val();

            if (databaseRoom) {
                console.log(databaseRoom, 'db')
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
                console.log(databaseRoom, 'fb')

                const parsedQuestions = Object.entries(firebaseQuestions).map(
                    ([key, value]) => {
                        return {
                            id: key,
                            content: value.content,
                            author: value.author,
                            isHighLighted: value.isHighLighted,
                            isAnswered: value.isAnswered,
                            likeCount: Object.values(value.likes ?? {}).length,
                            hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id),
                            likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                        };
                    }
                );
                setQuestions(parsedQuestions);
                setTitle(databaseRoom.title);
            }

        });


        return () => {
            console.log('off')
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    return { questions, title }

}
