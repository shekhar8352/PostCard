"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "lucide-react";
import { searchUsersForMention } from "@/lib/actions/user.actions";

interface MentionUser {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
}

interface UserMentionProps {
    value: string;
    onChange: (value: string) => void;
    onMentionSelect?: (users: MentionUser[]) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

export function UserMention({
    value,
    onChange,
    onMentionSelect,
    placeholder,
    className,
    rows = 15,
}: UserMentionProps) {
    const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionedUsers, setMentionedUsers] = useState<MentionUser[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const debounceSearch = useCallback(
        debounce(async (query: string) => {
            if (query.length > 0) {
                try {
                    const users = await searchUsersForMention(query);
                    setSuggestions(users);
                    setShowSuggestions(true);
                    setSelectedIndex(0);
                } catch (error) {
                    console.error("Error searching users:", error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    // Handle text change and detect @ mentions
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Find current cursor position
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = newValue.substring(0, cursorPosition);

        // Look for @ mentions
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            const query = mentionMatch[1];
            debounceSearch(query);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }

        // Extract mentioned users from the text
        const mentionRegex = /@(\w+)/g;
        const mentions = Array.from(newValue.matchAll(mentionRegex));
        const currentMentions = mentions.map(match => match[1]);

        // Update mentioned users list
        const updatedMentionedUsers = mentionedUsers.filter(user =>
            currentMentions.includes(user.username)
        );

        setMentionedUsers(updatedMentionedUsers);
        onMentionSelect?.(updatedMentionedUsers);
    };

    // Handle suggestion selection
    const selectSuggestion = (user: MentionUser) => {
        if (!textareaRef.current) return;

        const cursorPosition = textareaRef.current.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const textAfterCursor = value.substring(cursorPosition);

        // Find the @ symbol position
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        if (!mentionMatch) return;

        const mentionStart = textBeforeCursor.lastIndexOf('@');
        const newText =
            value.substring(0, mentionStart) +
            `@${user.username} ` +
            textAfterCursor;

        onChange(newText);

        // Add user to mentioned users if not already present
        if (!mentionedUsers.find(u => u.username === user.username)) {
            const updatedUsers = [...mentionedUsers, user];
            setMentionedUsers(updatedUsers);
            onMentionSelect?.(updatedUsers);
        }

        setShowSuggestions(false);
        setSuggestions([]);

        // Focus back to textarea
        setTimeout(() => {
            if (textareaRef.current) {
                const newCursorPosition = mentionStart + user.username.length + 2; // +2 for @ and space
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        }, 0);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (suggestions[selectedIndex]) {
                    selectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSuggestions([]);
                break;
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                textareaRef.current &&
                !textareaRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`w-full ${className}`}
                rows={rows}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-dark-2 border border-dark-4 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                    {suggestions.map((user, index) => (
                        <div
                            key={user._id}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-dark-3 ${index === selectedIndex ? 'bg-dark-3' : ''
                                }`}
                            onClick={() => selectSuggestion(user)}
                        >
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-dark-4 flex items-center justify-center">
                                    <User className="w-4 h-4 text-light-2" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-light-1 font-medium truncate">{user.name}</p>
                                <p className="text-light-3 text-sm truncate">@{user.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mentionedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {mentionedUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-2 bg-primary-500/20 text-primary-500 px-2 py-1 rounded-full text-sm"
                        >
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-4 h-4 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                            <span>@{user.username}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}