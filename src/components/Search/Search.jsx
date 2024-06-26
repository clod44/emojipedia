import React, { useEffect, useState, useRef } from 'react';
import { fetchFromCDN } from 'emojibase';
import Toast from '../Toast/Toast';

function Search() {
    const [emojis, setEmojis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [textInput, setTextInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeoutRef = useRef(null);
    const [toastMessage, setToastMessage] = useState('');
    const [emojiCount, setEmojiCount] = useState(0);

    const handleEmojiClicking = (emoji) => {
        navigator.clipboard.writeText(emoji.emoji);
        setToastMessage(`Copied ${emoji.emoji} to clipboard`);
    };

    useEffect(() => {
        fetchFromCDN('en/data.json')
            .then(data => setEmojis(data))
            .catch(error => console.error('Error fetching emoji data:', error));

        return () => {
            clearTimeout(debounceTimeoutRef.current);
        };
    }, []);
    useEffect(() => {
        setEmojiCount(emojis.length);
    }, [emojis]);

    const handleSearchTermChange = (event) => {
        const searchText = event.target.value;
        setTextInput(searchText);
        debounceSearch(searchText); // Debounced search term update
    };

    const debounceSearch = (value) => {
        setIsSearching(true);
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
            setIsSearching(false);
        }, 1000); // Adjust delay as needed
    };


    const filteredEmojis = emojis.filter((emoji) => {
        const searchTermLC = searchTerm.toLowerCase().trim(); // Trim the search term

        for (let key in emoji) {
            if (emoji.hasOwnProperty(key)) {
                const value = emoji[key];
                if ((typeof value === 'string' || typeof value === 'number') &&
                    value.toString().trim().toLowerCase().includes(searchTermLC)) { // Trim and lowercase the value
                    return true;
                } else if (Array.isArray(value)) {
                    if (value.some(item => item.toString().trim().toLowerCase().includes(searchTermLC))) { // Trim and lowercase the array items
                        return true;
                    }
                }
            }
        }

        return false;
    });



    function formatInfo(info = "") {
        if (Array.isArray(info)) {
            return info.join(', ');
        } else {
            return String(info); // Ensure non-array values are converted to strings
        }
    }


    return (
        <div>
            <label className="input input-bordered flex items-center gap-2">
                <input
                    type="text"
                    className="grow"
                    placeholder="smile..."
                    value={textInput}
                    onChange={handleSearchTermChange}
                />
                <span className="badge badge-primary">
                    {isSearching ? (
                        <span className="loading loading-dots loading-md"></span>
                    ) : (
                        emojiCount > 0 ? (`${emojiCount} emojis`) : 'No results'
                    )}
                </span>
            </label>
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-compact mb-4">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Emoji</th>
                                <th>Emoticon</th>
                                <th>Label</th>
                                <th>Tags</th>
                                <th>Hexcode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmojis.slice(0, 20).map((emoji, index) => {
                                //console.log('Emoji:', emoji); 
                                return (
                                    <tr key={emoji.hexcode} className='hover cursor-pointer duration-100 active:scale-95' onClick={() => {
                                        handleEmojiClicking(emoji);
                                    }}>
                                        <th>{index + 1}</th>
                                        <td className='text-3xl' >{emoji.emoji}</td>
                                        <td>{formatInfo(emoji.emoticon)}</td>
                                        <td>{formatInfo(emoji.label)}</td>
                                        <td>{formatInfo(emoji.tags)}</td>
                                        <td>{formatInfo(emoji.hexcode)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>

                </div>
            </div>

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            )}
        </div>
    );
}

export default Search;
