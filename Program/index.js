// Importing necessary modules
const fs = require('fs');

// Transaction class representing individual transactions
class Transaction {
    /**
     * Create a new Transaction object.
     * @param {string} id - Transaction ID.
     * @param {string} date - Transaction date in format 'YYYY-MM-DD'.
     * @param {number} amount - Transaction amount.
     * @param {string} type - Transaction type ('debit' or 'credit').
     * @param {string} description - Transaction description.
     * @param {string} merchant - Merchant name.
     * @param {string} cardType - Type of card used.
     */
    constructor(id, date, amount, type, description, merchant, cardType) {
        this.transaction_id = id;
        this.transaction_date = date;
        this.transaction_amount = amount;
        this.transaction_type = type;
        this.transaction_description = description;
        this.merchant_name = merchant;
        this.card_type = cardType;
    }

    /**
     * Get the string representation of the transaction in JSON format.
     * @returns {string} - String representation of the transaction.
     */
    string() {
        return JSON.stringify(this);
    }
}

// TransactionAnalyzer class for processing transactions
class TransactionAnalyzer {
    /**
     * Create a TransactionAnalyzer.
     * @param {Array} transactions - The array of transactions.
     */
    constructor(transactions) {
    this.transactions = transactions;
    }

    /**
     * Add a transaction to the list of transactions.
     * @param {Object} transaction - The transaction to add.
     */
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }


    /**
     * Get all transactions.
     * @returns {Array} All transactions.
     */
    getAllTransactions() {
        return this.transactions;
    }

    /**
     * Get unique transaction types.
     * @returns {Array} Unique transaction types.
     */
    getUniqueTransactionType() {
        const types = new Set();
        this.transactions.forEach((transaction) =>
        types.add(transaction.transaction_type)
    );
    return Array.from(types);
    }  
    /**
     * Calculate total amount of all transactions.
     * @returns {number} - Total amount of all transactions.
     */
    calculateTotalAmount() {
        return this.transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Calculate total amount of transactions by specified date.
     * @param {number} year - Year of the date.
     * @param {number} month - Month of the date (1-12).
     * @param {number} day - Day of the date.
     * @returns {number} - Total amount of transactions on the specified date.
     */
    calculateTotalAmountByDate(year, month, day) {
        const filteredTransactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return (!year || transactionDate.getFullYear() === year) &&
                (!month || transactionDate.getMonth() + 1 === month) &&
                (!day || transactionDate.getDate() === day);
        });
        return filteredTransactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Get transactions of a specific type.
     * @param {string} type - Type of transactions ('debit' or 'credit').
     * @returns {Transaction[]} - Array of transactions of the specified type.
     */
    getTransactionByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }

    /**
     * Get transactions within a specified date range.
     * @param {string} startDate - Start date of the range in 'YYYY-MM-DD' format.
     * @param {string} endDate - End date of the range in 'YYYY-MM-DD' format.
     * @returns {Transaction[]} - Array of transactions within the specified date range.
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= start && transactionDate <= end;
        });
    }

    /**
     * Get transactions by merchant name.
     * @param {string} merchantName - Name of the merchant.
     * @returns {Transaction[]} - Array of transactions made with the specified merchant.
     */
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    /**
     * Calculate the average transaction amount.
     * @returns {number} - Average transaction amount.
     */
    calculateAverageTransactionAmount() {
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / this.transactions.length;
    }

    /**
     * Get transactions within a specified amount range.
     * @param {number} minAmount - Minimum transaction amount.
     * @param {number} maxAmount - Maximum transaction amount.
     * @returns {Transaction[]} - Array of transactions within the specified amount range.
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    /**
     * Calculate the total amount of debit transactions.
     * @returns {number} - Total amount of debit transactions.
     */
    calculateTotalDebitAmount() {
        const debitTransactions = this.getTransactionByType('debit');
        return debitTransactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Find the month with the most transactions.
     * @returns {string} - Month with the most transactions.
     */
    findMostTransactionsMonth() {
        const monthsMap = {};
        this.transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth();
            monthsMap[month] = (monthsMap[month] || 0) + 1;
        });
        const mostTransactionsMonth = Object.keys(monthsMap).reduce((a, b) => monthsMap[a] > monthsMap[b] ? a : b);
        return new Date(0, mostTransactionsMonth).toLocaleString('default', { month: 'long' });
    }

    /**
     * Find the month with the most debit transactions.
     * @returns {string} - Month with the most debit transactions.
     */
    findMostDebitTransactionMonth() {
        const debitTransactions = this.getTransactionByType('debit');
        const monthsMap = {};
        debitTransactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth();
            monthsMap[month] = (monthsMap[month] || 0) + 1;
        });
        const mostDebitMonth = Object.keys(monthsMap).reduce((a, b) => monthsMap[a] > monthsMap[b] ? a : b);
        return new Date(0, mostDebitMonth).toLocaleString('default', { month: 'long' });
    }

    /**
     * Find which type of transactions (debit/credit) has more occurrences.
     * @returns {string} - 'debit' if debit transactions are more, 'credit' if credit transactions are more, 'equal' if both are equal.
     */
    mostTransactionTypes() {
        const debitCount = this.getTransactionByType('debit').length;
        const creditCount = this.getTransactionByType('credit').length;
        if (debitCount > creditCount) {
            return 'debit';
        } else if (debitCount < creditCount) {
            return 'credit';
        } else {
            return 'equal';
        }
    }

    /**
     * Get transactions that occurred before a specified date.
     * @param {string} date - Date in 'YYYY-MM-DD' format.
     * @returns {Transaction[]} - Array of transactions occurred before the specified date.
     */
    getTransactionsBeforeDate(date) {
        const cutoffDate = new Date(date);
        return this.transactions.filter(transaction => new Date(transaction.transaction_date) < cutoffDate);
    }

    /**
     * Find a transaction by its ID.
     * @param {string} id - Transaction ID to search for.
     * @returns {Transaction|null} - Transaction object if found, null otherwise.
     */
    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id) || null;
    }

    /**
     * Map transaction descriptions to a new array.
     * @returns {string[]} - Array of transaction descriptions.
     */
    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }
}

// Reading transactions from JSON file
fs.readFile('transactions.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    
    try {
        const transactionsData = JSON.parse(data);
        const transactions = transactionsData.map(t => new Transaction(
            t.transaction_id,
            t.transaction_date,
            parseFloat(t.transaction_amount),
            t.transaction_type,
            t.transaction_description,
            t.merchant_name,
            t.card_type
        ));
        
        // Create TransactionAnalyzer object
        const analyzer = new TransactionAnalyzer(transactions);

        // Perform analysis and use the TransactionAnalyzer methods here

        console.log("Unique Transaction Types:", analyzer.getUniqueTransactionType());
        console.log("Total Amount:", analyzer.calculateTotalAmount());
        console.log("Total Amount By Date (2019-01-01):", analyzer.calculateTotalAmountByDate(2019, 1, 1));
        console.log("Transactions By Type (debit):", analyzer.getTransactionByType('debit'));
        console.log("Transactions In Date Range:", analyzer.getTransactionsInDateRange('2019-01-01', '2019-01-10'));
        console.log("Transactions By Merchant (SuperMart):", analyzer.getTransactionsByMerchant('SuperMart'));
        console.log("Average Transaction Amount:", analyzer.calculateAverageTransactionAmount());
        console.log("Transactions By Amount Range:", analyzer.getTransactionsByAmountRange(50, 150));
        console.log("Total Debit Amount:", analyzer.calculateTotalDebitAmount());
        console.log("Month With Most Transactions:", analyzer.findMostTransactionsMonth());
        console.log("Month With Most Debit Transactions:", analyzer.findMostDebitTransactionMonth());
        console.log("Most Transaction Types:", analyzer.mostTransactionTypes());
        console.log("Transactions Before Date (2019-01-05):", analyzer.getTransactionsBeforeDate('2019-01-05'));
        console.log("Transaction with ID 1:", analyzer.findTransactionById('1'));
        console.log("Transaction Descriptions:", analyzer.mapTransactionDescriptions());

    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});